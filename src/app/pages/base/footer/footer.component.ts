import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
  <footer class="p-4 bg-gray-100 rounded-lg shadow-lg">
    <div class="container mx-auto text-center">
      <p>© 2024 Your Company. All rights reserved.</p>
    </div>
  </footer>`,
})
export class FooterComponent {

}
