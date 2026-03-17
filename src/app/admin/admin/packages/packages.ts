import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Packagesservice } from '../../../service/packagesservice';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './packages.html',
  styleUrl: './packages.scss'
})
export class Packages implements OnInit {

  packages: any[] = [];
  addpackage!: FormGroup;
  editMode: boolean = false;
  selectedPackage: any = null;

  constructor(
    private fb: FormBuilder,
    private packageService: Packagesservice
  ) { }

  ngOnInit() {
    this.initForm();
    this.getPackages();
  }

  // Initialize Form
  initForm() {
    this.addpackage = this.fb.group({
      package_name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration_days: ['', Validators.required]
    });
  }

  // Add Package
  addPackage() {
    if (this.addpackage.invalid) {
      this.addpackage.markAllAsTouched();
      return;
    }

    if (this.editMode) {
      return this.updatePackage();
    }

    this.packageService.addPackage(this.addpackage.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Package Added',
          text: 'New package has been added successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        this.getPackages();
        this.hideAddModal();
        this.addpackage.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Add Failed',
          text: err.error?.detail || "Failed to add package"
        });
      }
    });
  }
  getPackages() {
    this.packageService.getPackages().subscribe((data: any) => {
      this.packages = data.packages;
    });
  }

  openAddModal() {
    this.editMode = false;
    this.selectedPackage = null;
    this.addpackage.reset();
    const modalEl = document.getElementById('addPackageModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  hideAddModal() {
    const modalEl = document.getElementById('addPackageModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }

  editPackage(pkg: any) {
    this.editMode = true;
    this.selectedPackage = pkg;
    this.addpackage.patchValue({
      package_name: pkg.package_name,
      description: pkg.description,
      price: pkg.price,
      duration_days: pkg.duration_days
    });
    const modalEl = document.getElementById('addPackageModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  updatePackage() {
    if (!this.selectedPackage) {
      return;
    }
    const payload = this.addpackage.value;
    this.packageService.updatePackage(this.selectedPackage._id, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Package Updated',
          text: 'Package details have been updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        this.getPackages();
        this.hideAddModal();
        this.addpackage.reset();
        this.editMode = false;
        this.selectedPackage = null;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.detail || "Failed to update package"
        });
      }
    });
  }

  deletePackage(pkg: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the package "${pkg.package_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageService.deletePackage(pkg._id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Package has been deleted.',
            'success'
          );
          this.getPackages();
        });
      }
    });
  }
}