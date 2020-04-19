import * as _ from 'lodash';
import { v4 } from 'uuid';
import { argvs as A, IOptions, argvs } from '../config';
import WS from 'ws';
import * as http from 'http';
const errorHandling = (err: Error) => {
	console.error(err);
};

interface IDataHeader {
	keyChain: Set<string>;
}

class Data {
	public header: IDataHeader;
	public message: any;
	constructor(message: any) {
		this.header = {
			keyChain: new Set(),
		};

		this.message = message;
	}

	public appendKeyChain(key: string) {
		if (!key) throw new Error('Key is required');
		if (this.header.keyChain.has(key)) return false;
		this.header.keyChain.add(key);
		return true;
	}
}

interface INodeConstructor {
	portListenTo?: number;
	hostListenTo?: string;
	serverPort?: number;
}

interface IPeerClient extends WS {}

class Peer extends WS.Server {
	private peerClient: IPeerClient | null;
	private isClientConnected: boolean;
	private clientRestartTimer: any;
	constructor(args: INodeConstructor = {}) {
		super({ port: args.serverPort || parseInt(A.serverPort) });
		const portListenTo = args.portListenTo || parseInt(A.portListenTo);
		const hostListenTo = args.hostListenTo || A.hostListenTo;
		const serverPort = args.serverPort || parseInt(A.serverPort);

		if (_.isNil(portListenTo) || _.isNaN(portListenTo)) {
			throw new Error('portListenTo is required');
		}

		if (_.isNil(hostListenTo) || _.isNaN(hostListenTo)) {
			throw new Error('hostListenTo is required');
		}

		if (_.isNil(serverPort) || _.isNaN(serverPort)) {
			throw new Error('serverPort is required');
		}

		console.log(`server is running at port ${serverPort}`);
		this.initServer();
		const initailListenTo = `ws://${hostListenTo}:${portListenTo}`;
		this.clientRestartTimer = null;
		this.peerClient = null;
		this.isClientConnected = false;
		this.initClient(initailListenTo);
	}

	private broadcasting(callback: (arg: WS) => any) {
		if (!this.clients.size) return;
		this.clients.forEach((client) => {
			callback(client);
		});
	}

	private initServer() {
		this.on('connection', (socket: WS, request: http.IncomingMessage) => {
			console.log('new connection');
			socket.pong(this.noop());
		});
		setInterval(() => this.broadcasting((client) => client.ping(this.noop)), 3000);
	}

	private noop() {}
	private heartBeat = () => {
		clearTimeout(this.clientRestartTimer);
		if (!this.peerClient) return;
		this.clientRestartTimer = setTimeout(() => {
			console.log('server connection lost...');
			this.peerClient && this.peerClient.terminate();
		}, 5000);
	};
	public initClient(listenTo: string) {
		if (!this.isClientConnected) {
			console.log(`peer client is connecting: ${listenTo}`);
		}
		try {
			this.isClientConnected = false;
			this.peerClient = new WS(listenTo);
			this.peerClient.on('ping', this.heartBeat);
			this.peerClient.on('error', (err) => this.peerClient?.terminate());
			this.peerClient.on('close', () => setTimeout(() => this.initClient(listenTo), 3000));
			this.peerClient.on('open', () => {
				console.log(`Peer client has been conncted to server ${listenTo}`);
				this.heartBeat();
			});
		} catch (e) {
			errorHandling(e);
		}
	}
}

export default Peer;
