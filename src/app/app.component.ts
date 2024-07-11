import {Component, HostListener, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, ReactiveFormsModule, NgIf, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  title = 'cookies';
  currency = "$";
  productsData: any;
  loader = true;
  loaderShowed = true;

  form = this.fb.group({
    product: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  });

  mainImageStyle: any;
  orderImageStyle: any;

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    this.mainImageStyle = {transform: "translate(" + ((e.clientX * 0.3) / 8) + "px," + ((e.clientY * 0.3) / 8) + "px)"};
    this.orderImageStyle = {transform: "translate(-" + ((e.clientX * 0.3) / 8) + "px,-" + ((e.clientY * 0.3) / 8) + "px)"};
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.loaderShowed = false;
    }, 2000);
    setTimeout(() => {
      this.loader = false;
    }, 3000);
    this.http.get("https://testologia.ru/cookies").subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, product?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if (product) {
      this.form.patchValue({product: product.title + ' (' + product.price + ' ' + this.currency + ')'});
    }
  }

  switchSugarFree(e: any) {
    this.http.get("https://testologia.ru/cookies" + (e.currentTarget.checked ? '?sugarfree' : ''))
      .subscribe(data => this.productsData = data);
  }

  changeCurrency() {
    let newCurrency = "$";
    let coefficient = 1;
    if (this.currency === "$") {
      newCurrency = "₽";
      coefficient = 90;
    } else if (this.currency === "₽") {
      newCurrency = "BYN";
      coefficient = 3;
    } else if (this.currency === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }
    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * coefficient).toFixed(1);
    });
  }

  confirmOrder() {
    if (this.form.valid) {
      this.http.post("https://testologia.ru/cookies-order", this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          }
        });
    }
  }
}