import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { element } from 'protractor';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      resposta => this.categories = resposta,
      error => alert('Erro ao carregar a Lista')
    );
  }

  deleteCategory(category: Category){
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (mustDelete){
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(item => item !== category),
        () => alert('Erro ao tentar excluir')
      );
    } 
  }
}
