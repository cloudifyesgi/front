import {TestBed} from '@angular/core/testing';
import {AuthenticationService} from "./authentication.service";
import {HttpClientModule} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";


describe('AuthenticationService', () => {
    let service: AuthenticationService;

    beforeEach(() => TestBed.configureTestingModule({
        // provide the component-under-test and dependent service
        providers: [
            AuthenticationService,
            ConstantsService,
            LocalStorageService
        ],
        imports: [
            HttpClientModule
        ]
    }));

    beforeEach(() => service = TestBed.get(AuthenticationService));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set localStorage', () => {
        const tokenValue = 'ceci est un token';
        localStorage.removeItem('token');
        service.setToken(tokenValue);
        const token = localStorage.getItem('token');
        expect(token).toEqual(tokenValue);
    });
});
