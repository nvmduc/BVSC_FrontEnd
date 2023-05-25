import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import * as CryptoJS from 'crypto-js';
import { TransactionHistoryService } from 'src/app/service/transaction-history.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-shareholder',
  templateUrl:'./shareholder.component.html',
  styleUrls: ['./shareholder.component.css']
})

export class ShareholderComponent implements OnInit {
  infoShaholder: FormGroup = new FormGroup({});
  searchForm;
  inputValues: number = 0;
  idReceive!: string;
  idGive!: string;
  fbGiveShares: FormGroup = new FormGroup({});
  fbReceiveShares: FormGroup = new FormGroup({});
  dataGiveShares: any = [];
  dataReceiveShares: any = [];
  giveShares!: number;
  receiveShares!: number;
  idMeeting!: number;
  p: number = 1; // Số trang hiện tại
  pageSize: number = 10; // Số mục trên mỗi trang
  list: any = [];
  data: any = [];
  toList: any[] = [];
  idShareholder!: string;
  randomNumber!: number;
  dataInfo: any = [];
  constructor(private http: HttpClient,private transaction_historyService: TransactionHistoryService, private shareholderService: ShareholderInfoService, private toastr: ToastrService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.searchForm = this.fb.group({
      search: '',
    });
    this.getShareholderByMeeting();

  }
  get h() {
    return this.searchForm.controls
  }
  ngOnInit(): void {
    this.isExceedNumberShares();
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
      if (res != null) {
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
        console.log(this.list)
      }
    })
  }
  dataFormHistory = this.fb.group({
    idShareholder: [""],
    idShareholderAuth: [""],
    amount: [""],
  })

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
      this.dataForm.value.idMeeting = this.idMeeting!;
      console.log(this.idMeeting)
      this.dataForm.value.password = valueMd5;
      console.log(this.dataForm)
      this.shareholderService.getByIdMeeting(this.idMeeting).subscribe((res: any) => {
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
        window.location.reload();
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

  getShareholder(id: string) {
    const min = 10000000;
    const max = 99999999;
    this.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    this.shareholderService.getById(id).subscribe((res) => {
      this.dataInfo = res
      this.dataInfo.items.password = this.randomNumber
    })
  }

  getIdReceive(idReceive: string) {
    this.shareholderService.getById(idReceive).subscribe((res: any) => {
      this.dataReceiveShares = res;
      //Form shareholder receive

      this.fbReceiveShares = this.fb.group({
        id: this.dataReceiveShares.items?.id,
        fullname: this.dataReceiveShares.items?.fullname,
        shareHolderCode: this.dataReceiveShares.items?.shareHolderCode,
        identityCard: this.dataReceiveShares.items?.identityCard,
        email: this.dataReceiveShares.items?.email,
        address: this.dataReceiveShares.items?.address,
        phoneNumber: this.dataReceiveShares.items?.phoneNumber,
        nationality: this.dataReceiveShares.items?.nationality,
        username: this.dataReceiveShares.items?.username,
        password: this.dataReceiveShares.items?.password,
        idMeeting: this.dataReceiveShares.items?.idMeeting,
        status: this.dataReceiveShares.items?.status,
        numberShares: this.dataReceiveShares.items?.numberShares,
        numberSharesAuth: this.dataReceiveShares.items?.numberSharesAuth,
        role: this.dataReceiveShares.items?.role,
      });
    });

  }

  searchIdentityCard: string = ''
  dataIdentity: any = [];
  getIdShareholder(idS: string) {
    this.getIdReceive(idS);

    this.getShareholder(idS)
  }
  onSearch() {
    console.log('Tìm kiếm:', this.searchIdentityCard);
    this.shareholderService.getByIdentityCard(this.searchIdentityCard).subscribe((res) => {
      if (res.status == 2) {
        this.toastr.error("Không tìm thấy cổ đông", "Thất bại")
        console.log(res);
      }
      else {
        this.dataIdentity = res
        const idGive = this.dataIdentity.items?.id
        // Give
        this.shareholderService.getById(idGive).subscribe((res: any) => {
          this.dataGiveShares = res;
          //Form shareholder give
          this.fbGiveShares = this.fb.group({
            id: this.dataGiveShares.items?.id,
            fullname: this.dataGiveShares.items?.fullname,
            shareHolderCode: this.dataGiveShares.items?.shareHolderCode,
            identityCard: this.dataGiveShares.items?.identityCard,
            email: this.dataGiveShares.items?.email,
            address: this.dataGiveShares.items?.address,
            phoneNumber: this.dataGiveShares.items?.phoneNumber,
            nationality: this.dataGiveShares.items?.nationality,
            username: this.dataGiveShares.items?.username,
            password: this.dataGiveShares.items?.password,
            idMeeting: this.dataGiveShares.items?.idMeeting,
            status: this.dataGiveShares.items?.status,
            numberShares: this.dataGiveShares.items?.numberShares,
            numberSharesAuth: this.dataGiveShares.items?.numberSharesAuth,
            role: this.dataGiveShares.items?.role,
          });
        });
      }


    });



  }

  isExceedNumberShares() {
    const numberShares = this.dataIdentity.items?.numberShares;
    const inputNumber = this.inputValues;

    return inputNumber > numberShares || inputNumber < 0;
  }

  onSubmitAuthority() {
    // Person receive
    const idReceive = this.dataReceiveShares.items?.id;
    this.fbReceiveShares.value.numberSharesAuth = this.dataReceiveShares.items?.numberSharesAuth + this.inputValues
    console.log(this.fbReceiveShares.value.numberSharesAuth);
    console.log(this.fbReceiveShares.value);
    // Person give
    const idGive = this.dataGiveShares.items?.id
    this.fbGiveShares.value.numberShares = this.dataGiveShares.items?.numberShares - this.inputValues;
    console.log(this.fbGiveShares.value.numberShares);
    console.log(this.fbGiveShares.value);

    // Setdata transaction history
    this.dataFormHistory.value.idShareholder = idReceive;
    this.dataFormHistory.value.idShareholderAuth = idGive;
    this.dataFormHistory.value.amount = String(this.inputValues);
    console.log(this.dataFormHistory.value);
    
    this.shareholderService.update(idReceive, this.fbReceiveShares.value).subscribe((res) => {
      this.shareholderService.update(idGive, this.fbGiveShares.value).subscribe((resGive) => {
        this.transaction_historyService.create(this.dataFormHistory.value).subscribe((resHistory) => {
          if (resHistory) {
            this.toastr.success("Lịch sử uỷ quyền đã được ghi lại", "Thành công")
          } else {
            this.toastr.error("Lịch sử uỷ quyền lưu không thành công", "Thất bại")
          }
        });
        if (res && resGive) {
          this.toastr.success("Uỷ quyền thành công", "Thành công")
          this.getShareholderByMeeting()
          setInterval(() => {
            window.location.reload();
          }, 1000);
        } else {
          this.toastr.error("Uỷ quyền không thành công", "Thất bại")
          this.getShareholderByMeeting()
        }
      });
    });
  }

  dataFormUploadFile = this.fb.group({
    file: [""],
    idMeeting: [""],
  })
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if (this.isValidExcelFile(this.selectedFile)) {
        // Xử lý tệp Excel hợp lệ ở đây
        // this.readExcelFile(this.selectedFile);
        this.toastr.success("File hợp lệ");
      } else {
        // Xử lý khi tệp Excel không hợp lệ
        this.toastr.error("File không hợp lệ");
      }
    }
  }
  private isValidExcelFile(file: File): boolean {
    // Kiểm tra định dạng tệp tin
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.log('Tệp không phải là tệp .xlsx');
      return false;
    }

    // Kiểm tra kích thước tệp tin
    const maxSizeInBytes = 10485760; // 10MB
    if (file.size > maxSizeInBytes) {
      console.log('Tệp quá lớn');
      return false;
    }

    // Kiểm tra cấu trúc và nội dung tệp tin ở đây (tuỳ vào yêu cầu của ứng dụng của bạn)

    return true;
  }
  // private readExcelFile(file: File) {
  //   const fileReader = new FileReader();
  //   fileReader.onload = (e: any) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  //     console.log(jsonData);
  //     // Xử lý dữ liệu từ tệp Excel ở đây
  //   };
  //   fileReader.readAsArrayBuffer(file);
  // }

  onSubmitFile(form: NgForm){
    if (form.valid) {
      if(this.selectedFile){
        const file: File = this.selectedFile;
        const data: any = this.route.snapshot.params['id'];
        console.log(data);
        
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('idMeeting', data);
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        this.http.post('http://localhost:8080/bvsc-mapp/api/v1/upload-excel', formData, { headers }).subscribe(
          (response) => {
            console.log('Tải lên thành công', response);
            this.toastr.success("Upload file thành công", "Thành công")
            this.getShareholderByMeeting()
          },
          (error) => {
            console.error('Lỗi khi tải lên', error);
            this.toastr.error("Upload file thất bại", "Thất bại")
            this.getShareholderByMeeting()
          }
        );
      }
      
    }
  }
  
}



