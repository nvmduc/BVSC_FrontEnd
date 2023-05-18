import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-shareholder',
  templateUrl: './shareholder.component.html',
  styleUrls: ['./shareholder.component.css']
})

export class ShareholderComponent implements OnInit {
  infoShaholder: FormGroup = new FormGroup({});
  searchForm;
  constructor(private shareholderService: ShareholderInfoService, private toastr: ToastrService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.searchForm = this.fb.group({
      search: '',
    });
    this.getShareholderByMeeting();
  }
  idMeeting!: number;
  ngOnInit(): void {
    this.getFromService();
    this.infoShaholder = this.fb.group({
      id: [''],
      fullname: [''],
      shareHolderCode: [''],
      identityCard: [''],
      email: [''],
      address: [''],
      phoneNumber: [''],
      nationality: [''],
      username: [''],
      password: [''],
      idMeeting: [''],
      status: [''],
      numberShares: [''],
      numberSharesAuth: [''],
      role: [''],
    })

  };
  getShareholderByMeeting() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.shareholderService.getByIdMeeting(this.idMeeting).subscribe((res) => {
      if(res!=null){
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
        console.log(this.list)

      }
    })
  }
  

  dataForm = this.fb.group({
    fullname: [""],
    shareHolderCode: [""],
    identityCard: [""],
    email: [""],
    address: [""],
    phoneNumber: [""],
    nationality: [""],
    username: [""],
    password: [""],
    idMeeting: [this.idMeeting],
    status: ["0"],
    numberShares: [""],
    numberSharesAuth: [""],
    role: [""],
  })

  get f() {
    return this.infoShaholder.controls;
  }

  list: any = [];
  data: any = [];
  toList: any[] = []
  
  getAllShareholder() {
    this.shareholderService.getAll().subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
      console.log(this.list)
    })
  }
  edit(id: string) {
    this.shareholderService.getById(id).subscribe((res: any) => {
      this.data = res;
      console.log(this.data.items.fullname)
      this.infoShaholder = this.fb.group({
        id: this.data.items.id,
        fullname: this.data.items.fullname,
        shareHolderCode: this.data.items.shareHolderCode,
        identityCard: this.data.items.identityCard,
        email: this.data.items.email,
        address: this.data.items.address,
        phoneNumber: this.data.items.phoneNumber,
        nationality: this.data.items.nationality,
        username: this.data.items.username,
        password: this.data.items.password,
        idMeeting: this.data.items.idMeeting,
        status: this.data.items.status,
        numberShares: this.data.items.numberShares,
        numberSharesAuth: this.data.items.numberSharesAuth,
        role: this.data.items.role,
      });
    });
  }
  getFromService() {
    this.idMeeting = this.route.snapshot.params['id'];
    this.shareholderService.getByIdMeeting(this.idMeeting).subscribe((res) => {
      this.data = res;
    })
  }
  delete(id: any) {
    this.idMeeting = this.route.snapshot.params['id'];
    this.shareholderService.getById(id).subscribe((res: any) => {
      if (window.confirm("Bạn có muốn xoá cổ đông có mã: " + `"${res.items.shareHolderCode}"` + " không?")) {
        this.shareholderService.delete(id).subscribe(() => {
          this.toastr.success("Xoá thành công", "Thành công")
          console.log("xoá thành công")
          this.getShareholderByMeeting()

          // setTimeout(() => window.location.reload(), 1000);
        })
      }
    })
  }
  onSubmit() {
    this.idMeeting = this.route.snapshot.params['id'];
    const password = this.dataForm.value.password;
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      // if(this.idMeeting != null){
      this.dataForm.value.idMeeting = this.idMeeting!;
      // }
      console.log(this.idMeeting)
      this.dataForm.value.password = valueMd5;
      console.log(this.dataForm)
      this.shareholderService.getByIdMeeting(this.idMeeting).subscribe((res: any) => {
        // this.list = [res];
        // this.toList = Object.values(this.list[0].items);
        console.log(res.items)
        const emailExists = res.items.some((item: { email: string, idMeeting: number }) => item.email === this.dataForm.value.email && item.idMeeting == this.idMeeting);
        const shareHolderCodeExists = res.items.some((item: { shareHolderCode: string, idMeeting: number }) => item.shareHolderCode === this.dataForm.value.shareHolderCode && item.idMeeting == this.idMeeting);
        const identityCardExists = res.items.some((item: { identityCard: string, idMeeting: number }) => item.identityCard === this.dataForm.value.identityCard && item.idMeeting == this.idMeeting);
        const phoneNumberExists = res.items.some((item: { phoneNumber: string, idMeeting: number }) => item.phoneNumber === this.dataForm.value.phoneNumber && item.idMeeting == this.idMeeting);
        const usernameExists = res.items.some((item: { username: string, idMeeting: number }) => item.username === this.dataForm.value.username && item.idMeeting == this.idMeeting);
        if (emailExists) {
          this.toastr.warning("Email đã tồn tại trong cuộc họp", "Thất bại");
          return;
        }
        else if (shareHolderCodeExists) {
          this.toastr.warning("Mã cổ đông đã tồn tại trong cuộc họp", "Thất bại");
          return;
        } else if (identityCardExists) {
          this.toastr.warning("CCCD/CMT đã tồn tại trong cuộc họp", "Thất bại");
          return;
        } else if (phoneNumberExists) {
          this.toastr.warning("Số điện thoại đã tồn tại trong cuộc họp", "Thất bại");
          return;
        } else if (usernameExists) {
          this.toastr.warning("Tài khoản đã tồn tại trong cuộc họp", "Thất bại");
          return;
        }
        else {
          this.shareholderService.create(this.dataForm.value).subscribe((res) => {
            if (res) {
              console.log("Insert Success")
              this.toastr.success("Thêm thành công", "Thành công")
              this.getShareholderByMeeting();
              this.dataForm = this.fb.group({
                fullname: [""],
                shareHolderCode: [""],
                identityCard: [""],
                email: [""],
                address: [""],
                phoneNumber: [""],
                nationality: [""],
                username: [""],
                password: [""],
                idMeeting: [this.idMeeting],
                status: ["0"],
                numberShares: [""],
                numberSharesAuth: [""],
                role: [""],
              })
            } else {
              console.log("Insert False")
              this.toastr.error("Không thành công", "Thất bại")
              this.getShareholderByMeeting()
            }
          });
        }
      });
    }
  }


  onSubmitUpdate() {
    const id = this.infoShaholder.value.id
    console.log(this.infoShaholder.value);
    this.shareholderService.update(id, this.infoShaholder.value).subscribe((res) => {
      if (res) {
        console.log("Update Success")
        this.toastr.success("Sửa thành công", "Thành công")
        this.getShareholderByMeeting()
      } else {
        console.log("Update False")
        this.toastr.error("Không thành công", "Thất bại")
        this.getShareholderByMeeting()
      }
    })
  }
  get g() {
    return this.dataForm.controls
  }

}


