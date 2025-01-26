import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../../../shared/interfaces/movie.interfaces';
import { environment } from '../../../../environments/environment.development';

@Pipe({
  name: 'movieImage'
})
export class MovieImagePipe implements PipeTransform {

  private readonly url = environment.baseUrl;

  transform(value: string): string {
    if (!value) {
      return 'no-movie-image.jpg';
    }
    return `${this.url}${value}`;
  }

}
