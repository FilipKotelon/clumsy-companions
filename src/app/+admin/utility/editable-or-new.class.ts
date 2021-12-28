import { FormGroup } from '@angular/forms';
import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Directive()
export abstract class EditableOrNew implements OnInit {
  protected id: string = null;
  abstract form: FormGroup;
  editMode = false;

  constructor(protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.init();
    });
  }

  protected abstract init()

  abstract onSubmit()
}