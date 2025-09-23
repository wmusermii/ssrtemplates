import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-nonavi',
  imports: [RouterOutlet],
  templateUrl: './nonavi.html',
  styleUrl: './nonavi.css'
})
export class Nonavi implements OnInit {
  ngOnInit(): void {
    console.log("Routes loaded: nonavi")
  }

}
