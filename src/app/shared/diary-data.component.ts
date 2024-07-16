import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DiaryEntry } from "./diary-entry.model";
import { diarySubject } from "./diary-entry.model";

@Injectable({providedIn:"root"})

export class DiaryDataService{



    constructor(private http: HttpClient) {}


    diaryEntries: DiaryEntry[] = [

    ]

    getDiaryEntries() {
        this.http.get<{diaryEntries: DiaryEntry[]}>('http://localhost:3000/diary-entries').subscribe((jsonData) => {
            this.diaryEntries = jsonData.diaryEntries;
            // this.diarySubject.next(this.diaryEntries)
        })
    }

}