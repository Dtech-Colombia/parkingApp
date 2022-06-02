import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service'
import { UtilService } from '../../service/util/util.service'
import { ParameterService } from '../../service/parameters/parameter.service'
import { format, formatISO, parseISO } from 'date-fns';
import { DatePipe } from '@angular/common';
import *  as moment from 'moment';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  reserveForm: FormGroup;
  parkingReserve: any = {};
  parkings: any = [];
  isSubmitted = false;
  errorSede = null;
  reserveDate: any = null;
  minDate: String = null;
  minTime: String = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private parameters: ParameterService,
    private util: UtilService,
    private formBuilder: FormBuilder) { }
    
  z = (n: string | number) => ('0' + n).slice(-2);

  ngOnInit() {
    this.reserveForm = this.formBuilder.group({
      parking: ['', [Validators.required]],
      initialDate: ['', [Validators.required]],
      initialTime: ['', [Validators.required]],
      finalTime: ['', [Validators.required]]
    });
    // https://stackoverflow.com/questions/49330139/date-toisostring-but-local-time-instead-of-utc/49332027#49332027
    const d = new Date();
    let off = d.getTimezoneOffset();
    off = Math.abs(off);
    let localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    localDate.setHours(localDate.getHours()+1,0,0,0);
    this.minDate = localDate.toISOString();
    this.minTime = moment(localDate).format('HH:mm');
    console.log(this.minTime)
  }

  ionViewDidEnter() {
    this.isSubmitted = false;
    console.log('minDate:' + this.minDate)
    this.api.doGET({ action: '/reserve/parkings' })
      .then((parkingsResponse: any) => {
        this.parkings = parkingsResponse;
      });
  }

  get errorControl() {
    return this.reserveForm.controls;
  }

  doReserve() {
    this.isSubmitted = true;
    this.parkingReserve.parking = this.reserveForm.value['parking'];
    this.parkingReserve.user = JSON.parse(this.parameters.getUserLogin())
    let initialDate = new Date(this.reserveForm.value['initialDate']);
    let finalDate = new Date(this.reserveForm.value['initialDate']);
    const tempInitialTime = new Date(this.reserveForm.value['initialTime']);
    const tempFinalTime = new Date(this.reserveForm.value['finalTime']);
    initialDate.setHours(tempInitialTime.getHours(), tempInitialTime.getMinutes())
    finalDate.setHours(tempFinalTime.getHours(), tempFinalTime.getMinutes())

    if(initialDate.toString() == finalDate.toString()){
      this.util.showAlert('Validacion','Las fechas son iguales');
      return;
    }    

    if(new Date() > initialDate){
      this.util.showAlert('Validacion','La fecha y hora debe ser superior a la fecha actual');
      return;
    }

    if(initialDate > finalDate){
      this.util.showAlert('Validacion','La hora final no puede ser mayor a la hora inicial');
      return;
    }
    this.parkingReserve.initialDate = initialDate;
    this.parkingReserve.finalDate = finalDate;
    
    this.api.doPost({ action: '/reserve/save', postData: this.parkingReserve })
      .then((reserve: any) => {
        this.util.showSimpleMessage('Éxito', 'La reserva ha sido registrada con el código' + reserve.id + '.\nGuarde este código en caso de alguna novedad al ingresar a la institución.');
        this.reserveForm.reset();
        this.isSubmitted = false;
      }).finally(() => { this.isSubmitted = false });
  }

  calculeMinTime(){
    const d = new Date(this.reserveForm.value['initialDate']);
    let off = d.getTimezoneOffset();
    off = Math.abs(off);
    let localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    localDate.setHours(localDate.getHours()+1,0,0,0);
    if(this.minDate != localDate.toISOString()){
      localDate.setHours(1,0,0,0);
    }
    console.log(localDate.toISOString())
    this.minTime = localDate.toISOString();
    console.log(this.minTime)
  }

  formatDate(value: string) {
    if (value)
      return format(parseISO(value), 'yyyy/MM/dd');
  }
  formatTime(value: string) {
    if (value)
      return format(parseISO(value), 'HH:mm');
  }

}
