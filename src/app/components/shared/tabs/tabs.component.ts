import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  signal,
  Input,
} from '@angular/core';
import { TabPanelComponent } from './tab-panel/tab-panel.component';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  imports: [IconComponent],
})
export class TabsComponent implements AfterContentInit {
  @Input() activeTab?: string;
  @ContentChildren(TabPanelComponent) tabPanels!: QueryList<TabPanelComponent>;

  tabs: TabPanelComponent[] = [];
  activeTabId = signal<string>('');

  ngAfterContentInit(): void {
    this.tabs = this.tabPanels.toArray();

    const initialTab = this.activeTab || this.tabs[0]?.id;
    if (initialTab) {
      this.selectTab(initialTab);
    }
  }

  selectTab(tabId: string): void {
    this.activeTabId.set(tabId);
    this.tabs.forEach((tab) => {
      tab.isActive.set(tab.id === this.activeTabId());
    });
  }
}
