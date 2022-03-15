export class Response {
    status?: number;
    body?: any;

    public setStatus(status: number) {
        this.status = status;
    }
    public getStatus(): number {
        return this.status;
    }
    public setBody(body: any) {
        this.body = body;
    }
    public getBody(): any {
        return this.body;
    }
  }