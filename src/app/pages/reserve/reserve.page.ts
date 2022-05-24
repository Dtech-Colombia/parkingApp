import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service'
import { UtilService } from '../../service/util/util.service'
import { ParameterService } from '../../service/parameters/parameter.service'
import { format, formatISO, parseISO} from 'date-fns';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  reserveForm : FormGroup;
  parkingReserve :any = {};
  parkings :any = [];
  isSubmitted = false;
  errorSede = null;
  reserveDate :any = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private parameters: ParameterService,
    private util: UtilService,
    private formBuilder: FormBuilder) {}
    
  ngOnInit() {
    this.reserveForm = this.formBuilder.group({
      parking: ['', [Validators.required]],
      initialDate: ['', [Validators.required]],
      initialTime: ['', [Validators.required]],
      finalTime: ['', [Validators.required]]
    });
  }

  ionViewDidEnter (){
    this.isSubmitted = false;
    console.log('funciona')
    this.api.doGET({action : '/reserve/parkings'}) 
      .then((parkingsResponse : any) => {
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
    let finalDate =  new Date(this.reserveForm.value['initialDate']);
    const tempInitialTime = new Date(this.reserveForm.value['initialTime']);
    const tempFinalTime =  new Date(this.reserveForm.value['finalTime']);
    initialDate.setHours(tempInitialTime.getHours(),tempInitialTime.getMinutes())
    finalDate.setHours(tempFinalTime.getHours(),tempFinalTime.getMinutes())
    this.parkingReserve.initialDate = initialDate;
    this.parkingReserve.finalDate = finalDate;
    this.api.doPost({action : '/reserve/save',postData:this.parkingReserve}) 
    .then((reserve : any) => {
      this.util.showSimpleMessage('Éxito','La reserva se ha realizado con éxito con el ID: ' + reserve.id)
    }).finally(()=>{this.isSubmitted=false});
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
