import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  @Output() getStartedEvt = new EventEmitter();

  currentCard = 0;

  constructor() { }

  public getStarted(){
    this.getStartedEvt.emit();
  }

  public whichCard(card: number){
    if(card === this.currentCard) {
      return { display : 'block' };
    } else {
      return { display : 'none' };
    }
  }

  ngOnInit(): void {}
}
