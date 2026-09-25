import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ABOUT_HERO_IMAGE_URL, ABOUT_STORY_IMAGE_URL } from '../../core/config/image-urls';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  imports: [RouterLink, Icon],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {
  readonly heroImageUrl = ABOUT_HERO_IMAGE_URL;
  readonly storyImageUrl = ABOUT_STORY_IMAGE_URL;
}
