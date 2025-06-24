import { spawn } from 'child_process';
import path from 'path';

interface StreamOptions {
  url: string;
  quality?: string;
  output?: string;
}

export class StreamHandler {
  private static instance: StreamHandler;
  private activeStreams: Map<string, any>;

  private constructor() {
    this.activeStreams = new Map();
  }

  public static getInstance(): StreamHandler {
    if (!StreamHandler.instance) {
      StreamHandler.instance = new StreamHandler();
    }
    return StreamHandler.instance;
  }

  public async startStream({ url, quality = "best", output }: StreamOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Generate a unique ID for this stream
        const streamId = Math.random().toString(36).substring(7);
        const outputPath = output || path.join(process.cwd(), 'temp', `${streamId}.m3u8`);

        // Create Streamlink process
        const streamlink = spawn('streamlink', [
          url,
          quality,
          '--player-external-http',
          '--player-external-http-port', '8080',
          '--hls-live-edge', '5',
          '--stream-segment-threads', '3',
          '--stream-timeout', '60',
          '--retry-streams', '1',
          '--retry-open', '3'
        ]);

        // Handle process events
        streamlink.stdout.on('data', (data) => {
          console.log(`Streamlink stdout: ${data}`);
        });

        streamlink.stderr.on('data', (data) => {
          console.error(`Streamlink stderr: ${data}`);
        });

        streamlink.on('close', (code) => {
          if (code !== 0) {
            console.error(`Streamlink process exited with code ${code}`);
            this.activeStreams.delete(streamId);
          }
        });

        // Store the process reference
        this.activeStreams.set(streamId, {
          process: streamlink,
          url: url,
          quality: quality,
          output: outputPath
        });

        // Return the stream URL
        resolve(`http://localhost:8080/${streamId}`);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async stopStream(streamId: string): Promise<void> {
    const stream = this.activeStreams.get(streamId);
    if (stream) {
      stream.process.kill();
      this.activeStreams.delete(streamId);
    }
  }

  public async getStreamInfo(streamId: string) {
    return this.activeStreams.get(streamId);
  }

  public async getAvailableQualities(url: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const streamlink = spawn('streamlink', ['--json', url]);
      let output = '';

      streamlink.stdout.on('data', (data) => {
        output += data;
      });

      streamlink.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(Object.keys(result.streams));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }
}

// Export singleton instance
export const streamHandler = StreamHandler.getInstance();
