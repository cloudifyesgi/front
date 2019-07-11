import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Socket} from 'ngx-socket-io';
import {ConstantsService} from "../../constants/constants.service";
import {Docify} from "../../../models/entities/Docify";
import {UserService} from "../User/user.service";

@Injectable({
    providedIn: 'root'
})
export class DocifyService {

    currentDocify = this.socket.fromEvent<Docify>('docify:content');

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private socket: Socket,
                private userService: UserService) {
    }

    create(name: string, parent_directory: string): Observable<HttpResponse<Docify>> {
        return this.http.post<Docify>(this.constantsService.getConstant('URL_DOCIFY'), {
            name,
            parent_directory
        }, {observe: "response"});
    }

    async load(docifyId: string): Promise<void> {
        // return this.http.get<Docify>(this.constantsService.getConstant('URL_DOCIFY') + '/' + docifyId, {observe: "response"});
        const user = await this.userService.getUser();
        this.socket.emit('docify:connect', {userId: user._id, docifyId: docifyId});
    }

    async update(docify: Docify): Promise<void> {
        const user = await this.userService.user;
        this.socket.emit('docify:update', {docify: docify, userId: user._id});
    }
}
