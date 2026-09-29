import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
})
export class LoadingState {
  readonly label = input('Please wait');
  readonly title = input('Loading...');
  readonly description = input('');
}
