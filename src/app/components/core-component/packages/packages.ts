import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Packagesservice } from '../../../service/packagesservice';
import { Route, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-packages',
  imports: [CommonModule],
  templateUrl: './packages.html',
  styleUrl: './packages.scss'
})
export class Packages {
  packages: any[] = [];
  hotelName: string = '';

  constructor(
    private packageServices: Packagesservice,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getPackages() {
    this.packageServices.getPackages().subscribe((data: any) => {
      this.packages = data.packages;
    });
  }

  bookNow(pkg: any) {
    debugger;
    this.router.navigate(['/booking'], {
      queryParams: {
        packageId: pkg.id,
        packageName: pkg.package_name,
        packageAmount: pkg.price,
        packageDuration: pkg.duration_days,
        hotelName: this.hotelName
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.hotelName = params['hotelName'] || '';
    });
    this.getPackages();
  }
}

