import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/models/meeting';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit {
  constructor(private fb: FormBuilder,private electionService:ElectionService,private candidateService:CandidateService, private toastr: ToastrService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.getAllByMeeting();
    this.selectedElectionId = this.toList[0].id;
    this.infoElection = this.fb.group({
      id: [''],
      idMeeting: [''],
      title: [''],
      description: [''],
      createdTime: [''],
      modifiedTime: ['']
    })
  }

  list:any[] = []
  toList:any[] = []
  idMeeting!: number;
  getAllByMeeting(): void {
    this.idMeeting = this.route.snapshot.params['id'];
    this.electionService.getByIdMeeting(this.idMeeting).subscribe((res:any) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
      console.log(this.toList)
    })
  }
  dataForm = this.fb.group({
    idMeeting: [this.idMeeting],
    title: [""],
    description: [""],
    createdTime: [Date.now()]
  })

  get g() {
    return this.dataForm.controls
  }

  data: any = [];
  infoElection: FormGroup = new FormGroup({});

  edit(id: string) {
    this.electionService.getById(id).subscribe((res: any) => {
      this.data = res;
      console.log(this.data.items.id)
      this.infoElection = this.fb.group({
        id: this.data.items.id,
        idMeeting: this.data.items.idMeeting,
        title: this.data.items.title,
        description: this.data.items.description,
        createdTime: this.data.items.createdTime,
        modifiedTime: this.data.items.modifiedTime,
      });
    });
  }
  delete(id: any) {
    // this.idMeeting = this.route.snapshot.params['id'];
    this.electionService.getById(id).subscribe((res: any) => {
      if (window.confirm("Bạn có muốn xoá cổ đông có mã: " + `"${res.items.content}"` + " không?")) {
        this.electionService.delete(id).subscribe(() => {
          this.toastr.success("Xoá thành công", "Thành công")
          console.log("xoá thành công")
          this.getAllByMeeting()

          // setTimeout(() => window.location.reload(), 1000);
        })
      }
    })
  }
  onSubmitUpdate() {
    const id = this.infoElection.value.id
    this.infoElection.value.modifiedTime = Date.now();
    console.log(this.infoElection.value);
    this.electionService.update(id, this.infoElection.value).subscribe((res) => {
      if (res) {
        console.log("Update Success")
        this.toastr.success("Sửa thành công", "Thành công")
        this.edit(id);
        this.getAllByMeeting()
      } else {
        console.log("Update False")
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    })
  }
  onSubmit() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.dataForm.value.idMeeting = this.idMeeting;
    console.log(this.dataForm.value)
    this.electionService.create(this.dataForm.value).subscribe((res) => {
      if (res) {
        console.log("Insert Success")
        this.toastr.success("Thêm thành công", "Thành công")
        console.log(this.dataForm.value)
        this.getAllByMeeting();
        this.dataForm = this.fb.group({
          idMeeting: [this.idMeeting],
          title: [""],
          description: [""],
          createdTime: [Date.now()]
        })
      } else {
        console.log("Insert False")
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    });
  }

  selectedElectionId!: string;

  getIdElection(id:string){
    this.selectedElectionId = id;
    console.log(this.selectedElectionId)
  }
  toListCandidate:any[] = []
  getAllByElection(): void {
    console.log(this.selectedElectionId)
    this.candidateService.getByIdElection(this.selectedElectionId).subscribe((res:any) => {
      this.list = [res];
      this.toListCandidate = Object.values(this.list[0].items);
      console.log(this.toListCandidate)
    })
  }
}
