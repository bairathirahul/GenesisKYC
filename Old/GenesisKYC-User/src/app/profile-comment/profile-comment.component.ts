import {Component, OnInit} from '@angular/core';
import {Comment} from '../models/comment';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-comment',
  templateUrl: './profile-comment.component.html',
  styleUrls: ['./profile-comment.component.css']
})
export class ProfileCommentComponent implements OnInit {
  comments: Array<Comment>;

  constructor(private customerService: CustomerService) {
    this.comments = customerService.comments;
  }

  ngOnInit() {
  }

}
