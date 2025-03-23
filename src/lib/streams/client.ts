type QueryParams = Record<string, string>;

export interface Stream {
    name: string;
    partitions: number;
    codec: string;
}

export interface Consumer {
    stream: string;
    consumer: string;
}

export interface PartitionLag {
    partition: number;
    pos: number;
    end: number;
    lag: number;
}

export interface ConsumerPosition {
    stream: string;
    consumer: string;
    lag: number;
    lags: PartitionLag[];
}

export class StreamsClient {
    private baseUrl: string;
    private headers: Headers;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.headers = new Headers();
    }

    setHeader(key: string, val: string) {
        this.headers.set(key, val);
    }

    getStreams(): Promise<Stream[]> {
        return this.getJson('/api/v1/management/stream/streams');
    }


    getStreamConsumers(stream: string): Promise<Consumer[]> {
        const url = `/api/v1/management/stream/consumers?stream=${stream}`;
        return this.getJson(url);
    }

    getConsumerPosition(stream: string, consumer: string): Promise<ConsumerPosition> {
        const url = `/api/v1/management/stream/consumer/position?stream=${stream}&consumer=${consumer}`;
        return this.getJson(url);
    }

    private async fetchJson(method: string, path: string, body?: BodyInit) {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method: method,
            headers: this.headers,
            body: body,
        });
        if (response.status >= 300) {
            throw new Error('Unexpected status code');
        }

        return response.json();
    }

    private async getJson(path: string): Promise<any> {
        return this.fetchJson('GET', path);
    }

    private paramsToString(params: QueryParams) {
        const vals = [];
        for (const [k, v] of Object.entries(params)) {
            vals.push(`${k}=${v}`);
        }
        if (vals.length) {
            return `?${vals.join()}`;
        }
        return '';
    }

}

export function createWithHeader(baseUrl: string, headerName: string, headerValue: string): StreamsClient {
    const client = new StreamsClient(baseUrl);
    client.setHeader(headerName, headerValue);
    return client;
}

export function createWithBasicAuth(baseUrl: string, username: string, password: string): StreamsClient {
    const usernamePassword = btoa(`${username}:${password}`);
    return createWithHeader(baseUrl, 'Authorization', `Basic ${usernamePassword}`);
}
