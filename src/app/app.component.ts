import { Component } from '@angular/core';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { filter, flatMap, distinct, take } from 'rxjs/operators';

export class Application {
  constructor(private formId: number, private formName: string) {}
  private applicants: Array<Applicant> = new Array<Applicant>();
  addApplicant(applicant: Applicant) :Application {
    this.applicants.push(applicant);
    return this;
  }
  getFormId(): number {
    return this.formId;
  }
  getFormName(): string {
    return this.formName;
  }
}

export class Applicant {
  constructor(id: number, name: string, age:number) {}
}


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

  private appSubject = new BehaviorSubject<Array<Application>>(null);
  private appObs$ : Observable<Array<Application>> = this.appSubject
                                                      .pipe(
                                                        filter(input => !!input)
                                                      );

  loadInitialData(): Observable<Array<Application>> {

    let app1 = new Application(1, 'Home-Loan')
    .addApplicant(new Applicant(1, 'father', 45))
    .addApplicant(new Applicant(1, 'mother', 42));

    let app2 = new Application(1, 'Car-Loan')
    .addApplicant(new Applicant(1, 'father', 45))
    .addApplicant(new Applicant(1, 'mother', 42));

    let app3 = new Application(1, 'Personnal-Loan')
    .addApplicant(new Applicant(1, 'father', 45))
    .addApplicant(new Applicant(1, 'mother', 42));

    return of([app1, app2, app3]);
  }

  addApplication(newApplication: Application) {
    this.appSubject
      .pipe(
        take(1)
      )
      .subscribe(currentData => {
        let newData = [...currentData, newApplication];
        this.appSubject.next(newData);
      });
  }

  updateApplication(updatedApplication: Application) {
    this.appSubject
      .pipe(
        take(1)
      )
      .subscribe(currentData => {
        const upatedElement = currentData.find(input => input.getFormId() === updatedApplication.getFormId());
        let newData = [...currentData.splice(currentData.indexOf(upatedElement, 0), 1), updatedApplication];
        this.appSubject.next(newData);
      });
  }

  deleteApplication(formId: number) {
    this.appSubject
      .pipe(
        take(1)
      )
      .subscribe(currentData => {
        const upatedElement = currentData.find(input => input.getFormId() === formId);
        this.appSubject.next(currentData.splice(currentData.indexOf(upatedElement, 0), 1));
      });
  }

  applicationAddStream(): Observable<Application> {
    return this.appObs$
      .pipe(
        flatMap(inputArray => inputArray),
        distinct(input => input.getFormId)
      )
  }

  applicationUpdateStream(): Observable<Application> {
    return this.appObs$
      .pipe(
        flatMap(inputArray => inputArray),
        distinct(input => input.getFormName)
      )
  }

  applicationDeleteStream(): Observable<Application> {
    return this.appObs$
      .pipe(
        flatMap(inputArray => inputArray),
        distinct(input => input.getFormName)
      )
  }
}
