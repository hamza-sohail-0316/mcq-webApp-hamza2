import { formatDate } from '@angular/common';
import { Component, OnInit, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TestCategoryService } from '../test-category.service';



@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})

export class CategoryDetailsComponent implements OnInit {

  constructor(
    private testCategoryService: TestCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    if (id > 0 && !isNaN(id)) {
      this.categoryId = id;
      this.getCategory(this.categoryId);
    }
  }

  getCategory(categoryId: number) {
    this.testCategoryService.getCategories()

      .then((categories) => {
        let category = categories.find((object: { categoryID: number; }) => {
          return object.categoryID === categoryId;
        })
        console.table(categories);
        console.table(category);

        this.CategoryDetailsForm.setValue({
          categoryName:category.categoryName,
          active: category.active
        })

      })
  }

  categoryId: number = 0;
  currentDate = new Date;
  categoryDate = formatDate(this.currentDate, 'dd-MM-yyyy hh:mm a', 'en-US');

  CategoryDetailsForm = new FormGroup({
    categoryName: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    active: new FormControl(true),
  })


  showErrorMessage(fieldName: string) {
    let errors = this.CategoryDetailsForm.get(fieldName)?.errors;

    if (errors) {
      if (errors['required']) return 'category name is required';
      if (errors['required']) return 'category name must be 5 character long';
      return '';
    }
    else return '';

  }// show error message end.

  resetForm() {

    console.log('reset button works')

    this.CategoryDetailsForm.reset();
    console.log('form reset sucessfully')
  }// reset form method ends.

  saveTestCategory() {
    console.log('save button works');

    this.testCategoryService.saveCategory({
      categoryID: this.categoryId,
      categoryName: this.CategoryDetailsForm.get('categoryName')?.value,
      active: this.CategoryDetailsForm.get('active')?.value,
      createdDate: this.categoryDate

    })
      .then(() => {
        this.router.navigateByUrl('testCategory');
      })
      .catch((error) => {
        console.log(error)
      })
    // console.log('Category ID : ' + this.categoryId);
    // console.log('Created Date : ' + Date.now());

    // let name = this.CategoryDetailsForm.get('categoryName')?.value;
    // console.log('category Name : ' + name);

    // let active = this.CategoryDetailsForm.get('active')?.value;
    // console.log('active :' + active);
  }



  cancelTestCategory() {
    console.log('cancel button works')
    // this.router.navigateByUrl('testCategory')
    // .catch((error)=> {
    //   console.log(error)
    // })
  }

}
