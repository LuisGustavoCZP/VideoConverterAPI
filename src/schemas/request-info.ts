import { Request } from "express"

export default interface IRequestInfo extends Request {
    info: {
        startTime: number, 
        url: string
    }
}