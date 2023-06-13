import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit {
  idElection!: string
  selectedElectionId!: string;
  list: any[] = []
  toList: any[] = []
  idMeeting!: number;
  toListCandidate: any[] = []
  data: any = [];
  myDate!: string;
  formattedBirthday!: string;
  birthday: any
  infoElection: FormGroup = new FormGroup({});
  infoCandidate: FormGroup = new FormGroup({});

  dateFormControl: FormControl = new FormControl();

  dataFormCandidate = this.fb.group({
    idElection: [this.idElection],
    fullname: [""],
    birthday: [""],
    address: [""],
    summaryInfo: [""]
  })

  dataForm = this.fb.group({
    idMeeting: [this.idMeeting],
    title: [""],
    description: [""],
    numberOfElected: [""],
    createdTime: [Date.now()],
    status: [0],
  })
  role!:number
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private electionService: ElectionService, private candidateService: CandidateService, private toastr: ToastrService, private route: ActivatedRoute) {
    this.role = Number(localStorage.getItem('role'))
  }
  ngOnInit(): void {

    this.getAllByMeeting();
    this.getAllCandidate();
    this.infoElection = this.fb.group({
      idMeeting: [''],
      title: [''],
      description: [''],
      numberOfElected: [''],
      createdTime: [''],
      modifiedTime: [''],
      status: ['']
    })
    this.infoCandidate = this.fb.group({
      // id: [''],
      idElection: [''],
      fullname: [''],
      birthday: [''],
      address: [''],
      summaryInfo: ['']
    })
  }

  getAllCandidate(): void {
    this.candidateService.getAll().subscribe((res: any) => {
      this.list = [res];
      this.toListCandidate = Object.values(this.list[0].items);
    })
  }
  getAllByMeeting(): void {
    this.idMeeting = this.route.snapshot.params['id'];
    this.electionService.getByIdMeeting(this.idMeeting).subscribe((res: any) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
    })
  }


  edit(id: string) {
    this.electionService.getById(id).subscribe((res: any) => {
      this.data = res;
      this.infoElection = this.fb.group({
        id: this.data.items.id,
        idMeeting: this.data.items.idMeeting,
        title: this.data.items.title,
        description: this.data.items.description,
        numberOfElected: this.data.items.numberOfElected,
        createdTime: this.data.items.createdTime,
        modifiedTime: this.data.items.modifiedTime,
        status: this.data.items.status,
      });
    });
  }


  editCandidate(id: number) {
    this.candidateService.getById(id).subscribe((res: any) => {
      this.data = res;
      this.dateFormControl.setValue(new Date());
      this.data.items.birthday = moment(this.data.items.startTime).utc().subtract(7, 'hours');
      this.infoCandidate = this.fb.group({
        id: this.data.items.id,
        idElection: this.data.items.idElection,
        fullname: this.data.items.fullname,
        birthday: this.datePipe.transform(this.data.items.birthday, 'yyyy-MM-dd'),
        address: this.data.items.address,
        summaryInfo: this.data.items.summaryInfo,
      });
    });
  }
  deleteCandidate(id: number) {
    this.candidateService.getById(id).subscribe((res: any) => {
      if (window.confirm("Bạn có muốn xoá: " + `"${res.items.fullname}"` + " không?")) {
        this.candidateService.delete(id).subscribe(() => {
          this.toastr.success("Xoá thành công", "Thành công")
          this.getAllCandidate()
        })
      }
      res.items.birthday = this.birthday
    })
  }
  selectIdElection(selectIdByElection: string) {
    this.idElection = selectIdByElection
  }
  onSubmitUpdateCadidate() {
    const id = this.infoCandidate.value.id
    this.candidateService.update(id, this.infoCandidate.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Sửa thành công", "Thành công")
        this.edit(id);
        this.getAllCandidate()
      } else {
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllCandidate()
      }
    })
  }
  onSubmitCandidate() {
    this.dataFormCandidate.value.idElection = this.idElection
    this.candidateService.create(this.dataFormCandidate.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Thêm thành công", "Thành công")
        this.getAllCandidate();
        this.dataFormCandidate = this.fb.group({
          idElection: [this.idElection],
          fullname: [""],
          birthday: [""],
          address: [""],
          summaryInfo: [""]
        })
      } else {
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllCandidate()
      }
    });
  }

  // Delete Election 
  delete(id: any) {
    this.electionService.getById(id).subscribe((res: any) => {
      if (window.confirm("Bạn có muốn xoá: " + `"${res.items.title}"` + " không?")) {
        this.electionService.delete(id).subscribe(() => {
          this.candidateService.deleteByIdElection(id).subscribe(() => {
            this.toastr.success("Xoá thành công", "Thành công");
            this.getAllByMeeting();
          });
        })
      }
    })
  }
  onSubmitUpdate() {
    const id = this.infoElection.value.id
    this.infoElection.value.modifiedTime = Date.now();
    console.log(this.infoElection.value.status);
    
    this.electionService.update(id, this.infoElection.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Sửa thành công", "Thành công")
        this.edit(id);
        this.getAllByMeeting()
      } else {
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    })
  }
  
  onSubmit() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.dataForm.value.idMeeting = this.idMeeting;
    this.electionService.create(this.dataForm.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Thêm thành công", "Thành công")
        this.getAllByMeeting();
        this.dataForm = this.fb.group({
          idMeeting: [this.idMeeting],
          title: [""],
          description: [""],
          numberOfElected: [""],
          createdTime: [Date.now()],
          status: [0]
        })
      } else {
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    });
  }

  get g() {
    return this.dataForm.controls
  }
  get f() {
    return this.dataFormCandidate.controls
  }

}
