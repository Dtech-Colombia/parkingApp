import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { UtilService } from 'src/app/service/util/util.service';

export class ServiceOption {
  action: string;
  endPoint?: string;
  postData?: any;
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private errors = { msg: '', showError: false };

  constructor(
    private http: HttpClient,
    private util: UtilService,
    private alertController: AlertController
  ) {
    this.errors.msg = '';
    this.errors.showError = false;
  }
  /**
   * @param options
   *  endpoint: (Optional) indicate the service base url where de services are stored
   *  action : (Mandatory) indicate the specific service to consume
   *  postData : (Optional) the parameters to send to service
   *  timeOut : (Optional) Waiting time for response from service
   */
  public async doPost(options: ServiceOption): Promise<any> {
    let endPoint = options.endPoint;
    try {

      if (!endPoint)
        endPoint = environment.endPoint

      await this.util.showLoading();

      let postData = options.postData;
      if (!postData) {
        postData = {};
      }
      const headers = new HttpHeaders({
        'Content-type': 'application/json',
        'Accept': 'application/json'
      });

      const data = JSON.stringify(options.postData);
      console.log('service request:' + data);
      const dataResponse: any = await this.http.post(endPoint + options.action,         //url completa
        data,                                                   //requestBody de la peticion post
        { headers, responseType: JSON.parse('"text"') })
        .pipe(timeout(60000))                                   //timeout de la peticion
        .toPromise();                                           //Se obtiene la promesa, no se usan observables debido a que sólo hace una petición y ésta no es cancelable,
                                                                //por lo tanto se debe esperar a la respuesta del servidor
      let dataResp = JSON.parse(dataResponse);
      console.log('service response:' + dataResponse);
      if (dataResp.success) {
        await this.util.dismissLoading();
        return dataResp;
      } else {
        throw new Error(dataResp.errorMessage);
      }
    } catch (error) {
      let msgError = error.message ? error.message : error.statusMessage ? error.statusMessage : error;
      if (error.name === 'TimeoutError') {
        console.log('Timeout in ' + endPoint + options.action)
        msgError = 'No se pudo obtener conexion con el servidor. Por favor intente más tarde';
      }
      if (error.name === 'HttpErrorResponse') {
        console.log('HttpErrorResponse in ' + endPoint + options.action);
        if (error.status == 404) {
          msgError = 'No existe el recurso ' + options.action;
        }
      }
      this.errors.msg = '<li>' + msgError;
      this.errors.showError = true;
      error.msgError = msgError;
      await this.util.dismissLoading();
      throw error;
    } finally {
      await this.showError();
      this.errors.msg = '';
      this.errors.showError = false;
    }

  }
  public async showError() {
    if (this.errors.showError) {
      if (this.errors.msg.length > 0) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: this.errors.msg,
          buttons: ['ok']
        });
        return alert.present();
      }
    }
  }
}
