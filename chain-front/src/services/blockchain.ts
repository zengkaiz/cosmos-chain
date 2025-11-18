import { Tendermint37Client, HttpClient } from '@cosmjs/tendermint-rpc';

// Helper function to convert Uint8Array to hex string (browser-compatible)
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export interface BlockInfo {
  height: number;
  hash: string;
  time: string;
  proposer: string;
  txCount: number;
}

export interface ChainInfo {
  chainId: string;
  latestBlockHeight: number;
  latestBlockTime: string;
}

class BlockchainService {
  private tmClient: Tendermint37Client | null = null;
  private rpcEndpoint: string;

  constructor(rpcEndpoint: string = 'http://localhost:26657') {
    this.rpcEndpoint = rpcEndpoint;
  }

  async connect(): Promise<void> {
    try {
      let httpUrl = this.rpcEndpoint;

      // Handle relative paths (for proxy)
      if (httpUrl.startsWith('/')) {
        const protocol = window.location.protocol;
        const host = window.location.host;
        httpUrl = `${protocol}//${host}${httpUrl}`;
        console.log('Using proxy path:', httpUrl);
      } else if (!httpUrl.startsWith('http://') && !httpUrl.startsWith('https://')) {
        httpUrl = 'http://' + httpUrl;
      }

      console.log('Connecting to RPC endpoint:', httpUrl);

      // Create HTTP client for Tendermint RPC
      const httpClient = new HttpClient(httpUrl);
      this.tmClient = Tendermint37Client.create(httpClient);

      console.log('Tendermint client connected');
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.tmClient) {
      this.tmClient.disconnect();
      this.tmClient = null;
    }
  }

  async getChainInfo(): Promise<ChainInfo> {
    if (!this.tmClient) {
      throw new Error('Client not connected');
    }

    console.log('Getting status from Tendermint...');
    const status = await this.tmClient.status();
    console.log('Status received:', status);

    const chainId = status.nodeInfo.network;
    const height = status.syncInfo.latestBlockHeight;
    const latestBlockTime = status.syncInfo.latestBlockTime.toISOString();

    console.log('Chain ID:', chainId);
    console.log('Height:', height);

    return {
      chainId,
      latestBlockHeight: height,
      latestBlockTime,
    };
  }

  async getLatestBlockHeight(): Promise<number> {
    if (!this.tmClient) {
      throw new Error('Client not connected');
    }
    const status = await this.tmClient.status();
    return status.syncInfo.latestBlockHeight;
  }

  async getBlock(height?: number): Promise<BlockInfo> {
    if (!this.tmClient) {
      throw new Error('Client not connected');
    }

    const block = height ? await this.tmClient.block(height) : await this.tmClient.block();

    return {
      height: block.block.header.height,
      hash: toHex(block.blockId.hash),
      time: block.block.header.time.toISOString(),
      proposer: toHex(block.block.header.proposerAddress),
      txCount: block.block.txs.length,
    };
  }

  async getBlocks(fromHeight: number, toHeight: number): Promise<BlockInfo[]> {
    if (!this.tmClient) {
      throw new Error('Client not connected');
    }

    // Fetch blocks in parallel for better performance
    const promises: Promise<BlockInfo | null>[] = [];

    for (let height = fromHeight; height <= toHeight; height++) {
      promises.push(
        this.getBlock(height).catch((error) => {
          console.error(`Failed to fetch block ${height}:`, error);
          return null;
        })
      );
    }

    const results = await Promise.all(promises);
    return results.filter((block): block is BlockInfo => block !== null);
  }

  async getRecentBlocks(count: number = 10): Promise<BlockInfo[]> {
    const latestHeight = await this.getLatestBlockHeight();
    const fromHeight = Math.max(1, latestHeight - count + 1);
    return await this.getBlocks(fromHeight, latestHeight);
  }

  setRpcEndpoint(endpoint: string): void {
    this.rpcEndpoint = endpoint;
  }

  getRpcEndpoint(): string {
    return this.rpcEndpoint;
  }
}

export const blockchainService = new BlockchainService();
