import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Pipe({
  name: 'actorImage'
})
export class ActorImagePipe implements PipeTransform {

  private readonly url = environment.baseUrl;

  transform(value: string): string {
    if (!value) {
      return 'no-actor-image.jpg';
    }
    return `${this.url}${value}`;
  }

}
