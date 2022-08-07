import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() deletedObjectType: String = '';
  @Input() deletedObjectName: String = 'Unknown';

  deletedObject = false;

  constructor() {}
}
