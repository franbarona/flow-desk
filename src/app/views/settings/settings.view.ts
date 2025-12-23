import { Component, inject } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.view.html',
  imports: [SharedModule],
})
export class SettingsView {
    private readonly router = inject(Router);
    private readonly storage = inject(StorageService);

  repeatTutorial() {
    this.storage.removeItem('tourCompleted');
    this.router.navigate(['/projects'])
  }
}
