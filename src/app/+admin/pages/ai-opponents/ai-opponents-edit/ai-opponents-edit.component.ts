import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarsService } from '@core/avatars/avatars.service';
import { DecksService } from '@core/decks/decks.service';
import { MessageService } from '@core/message/message.service';
import { PacksService } from '@core/packs/packs.service';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';

@Component({
  selector: 'app-ai-opponents-edit',
  templateUrl: './ai-opponents-edit.component.html',
  styleUrls: ['./ai-opponents-edit.component.scss']
})
export class AiOpponentsEditComponent {}
