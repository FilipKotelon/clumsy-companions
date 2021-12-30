import { FormGroup } from '@angular/forms';
import { OnInit, Directive, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive()
export abstract class EditableOrNew implements OnInit, OnDestroy {
  protected id: string = null;
  abstract form: FormGroup;

  editMode = false;
  subs: Subscription[] = [];

  constructor(protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.init();
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  protected abstract init()

  abstract onSubmit()
}