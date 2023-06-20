import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
  role!:number
  constructor(private votingService: VotingService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.role = Number(localStorage.getItem('role'))
   }
  ngOnInit(): void {
    this.getAllByMeeting();
    this.infoVoting = this.fb.group({
      id: [''],
      idMeeting: [''],
      content: [''],
      createdTime: [''],
      modifiedTime: [''],
      status: ['']
    })
  }
  list: any[] = [];
  toList: any[] = [];
  idMeeting!: number;
  getAllByMeeting() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.votingService.getByIdMeeting(this.idMeeting).subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
      console.log(this.toList)
    })
  }

  dataForm = this.fb.group({
    idMeeting: [this.idMeeting],
    content: [""],
    createdTime: [Date.now()],
    status: [1],
  })
  get g() {
    return this.dataForm.controls
  }
  onSubmit() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.dataForm.value.idMeeting = this.idMeeting!;
    this.votingService.create(this.dataForm.value).subscribe((res) => {
      if (res) {
        console.log("Insert Success")
        this.toastr.success("Thêm thành công", "Thành công")
        console.log(this.dataForm.value)
        this.getAllByMeeting();
        this.dataForm = this.fb.group({
          idMeeting: [this.idMeeting],
          content: [""],
          createdTime: [Date.now()],
          status:[1]
        })
      } else {
        console.log("Insert False")
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    });
  }
  delete(id: any) {
    // this.idMeeting = this.route.snapshot.params['id'];
    this.votingService.getById(id).subscribe((res: any) => {
      if (window.confirm("Bạn có muốn xoá cổ đông có mã: " + `"${res.items.content}"` + " không?")) {
        this.votingService.delete(id).subscribe(() => {
          this.toastr.success("Xoá thành công", "Thành công")
          console.log("xoá thành công")
          this.getAllByMeeting()

          // setTimeout(() => window.location.reload(), 1000);
        })
      }
    })
  }

  data: any = [];
  infoVoting: FormGroup = new FormGroup({});

  edit(id: string) {
    this.votingService.getById(id).subscribe((res: any) => {
      this.data = res;
      console.log(this.data.items.id)
      this.infoVoting = this.fb.group({
        id: this.data.items.id,
        idMeeting: this.data.items.idMeeting,
        content: this.data.items.content,
        createdTime: this.data.items.createdTime,
        modifiedTime: this.data.items.modifiedTime,
        status: this.data.items.status,
      });
    });
  }
  get f() {
    return this.infoVoting.controls;
  }

  onSubmitUpdate() {
    const id = this.infoVoting.value.id
    this.infoVoting.value.modifiedTime = Date.now();
    console.log(this.infoVoting.value);
    this.votingService.update(id, this.infoVoting.value).subscribe((res) => {
      if (res) {
        console.log("Update Success")
        this.toastr.success("Sửa thành công", "Thành công")
        this.getAllByMeeting()
      } else {
        console.log("Update False")
        this.toastr.error("Không thành công", "Thất bại")
        this.getAllByMeeting()
      }
    })
  }
}
