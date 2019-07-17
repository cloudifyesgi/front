import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {DirectoryService} from "./directory.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Directory} from "../../../models/entities/directory";


describe('DirectoryService', () => {
    let service: DirectoryService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DirectoryService,
                ConstantsService
            ],
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ]
        });

        // We inject our service (which imports the HttpClient) and the Test Controller
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(DirectoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#getDirectory(string)', () => {
        const id = "azertyuiopqs";

        it("return a Directory", () => {
            const mockDirectory: Directory = {
                _id: id,
                name: "dir",
            };
            service.getDirectory(id).subscribe(
                responseDirectory => {
                    expect(responseDirectory.body.name).toEqual('dir');
                }
            );

            const req = httpTestingController.expectOne('http://localhost:6789/directory/' + id);
            expect(req.request.method).toEqual('GET');
            req.flush(mockDirectory);
        });

        it("return null", () => {
            const mockDirectory: Directory = null;

            service.getDirectory(id).subscribe(
                responseDirectory => {
                    expect(responseDirectory.status).toEqual(204);
                }
            );

            const req = httpTestingController.expectOne('http://localhost:6789/directory/' + id);
            expect(req.request.method).toEqual('GET');
            req.flush(mockDirectory);
        });
    });
});
