import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import * as _ from 'lodash';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CompanyService } from 'src/app/service/company.service';
import * as moment from 'moment-timezone';
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role!: number;
  constructor(private meetingService: MeetingService, private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private imageCompess: NgxImageCompressService,
    private http: HttpClient, private datePipe: DatePipe, private companyService: CompanyService, private route: ActivatedRoute) {
    this.idMeeting = this.route.snapshot.params['id'];
    this.role = Number(localStorage.getItem('role'))

    this.getAllMeetingByCompany();
  }
  idMeeting!: number

  ngOnInit(): void {
    this.imageControl = new FormControl(); // Tạo form control cho ảnh
    this.infoMeeting = new FormGroup({
      image: this.imageControl // Gán form control vào form group
    });
    this.getAllCompany()
    // this.getCompanyById()
    this.infoMeeting = this.fb.group({
      id: [],
      idCompany: [""],
      nameMeeting: [""],
      numberOrganized: [""],
      yearOrganized: [""],
      status: ["0"],
      imageBanner: [""],
      startTime: [""],
      endTime: [""],
      address: [""],
      description: [""],
    })
    this.infoCompany = this.fb.group({
      id: [],
      companyName: [""],
      stockCode: [""],
      taxCode: [""],
      address: [""],
      foundedYear: [""],
    })
  }
  imgURL: any;

  dataFormMeeting = this.fb.group({
    idCompany: [""],
    nameMeeting: [""],
    numberOrganized: [""],
    yearOrganized: [""],
    status: ["0"],
    imageBanner: [""],
    startTime: [""],
    endTime: [""],
    address: [""],
    description: [""],
  });

  dataFormCompany = this.fb.group({
    companyName: [""],
    stockCode: [""],
    taxCode: [""],
    address: [""],
    foundedYear: [""]
  });

  get g() {
    return this.dataFormMeeting.controls
  }
  isLoading: boolean = true;

  image!: any;
  imageBanner!: any
  fileUpload!: File
  base64String!: string

  url: any;

  onFileChanged(event: any) {
    console.log('Onfile change: ', event.target);

    const file = event.target.files[0]; // Lấy file từ sự kiện

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
      };
      reader.readAsDataURL(file);
    }

  }
  selectedFile: File | null = null;
  // base64String: string | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  onSubmit(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        this.base64String = base64String;
        this.uploadBase64ToServer(base64String);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmitCompany(): void {
    this.companyService.create(this.dataFormCompany.value).subscribe((res) => {
      if (res) {
        this.getAllCompany();
        this.toastr.success("Thêm công ty thành công", "Thành công");
      }
      else {
        this.toastr.error("Không thành công", "Thất bại");
      }
    })
  }

  onSubmitUpdateCompany(): void {
    const id = this.infoCompany.value.id
    this.companyService.update(id, this.infoCompany.value).subscribe((res) => {
      if (res) {
        this.getAllCompany();
        this.toastr.success("Sửa thông tin công ty thành công", "Thành công");
      }
      else {
        this.toastr.error("Không thành công", "Thất bại");
      }
    })
  }

  uploadBase64ToServer(base64String: string): void {
    this.dataFormMeeting.value.imageBanner = base64String;
    // Đặt múi giờ thành UTC+7
    moment.tz.setDefault('Asia/Bangkok');
    this.meetingService.create(this.dataFormMeeting.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Thêm mới thành công", "Thành công");
        this.getAllMeetingByCompany();
        this.router.navigate(['/admin'])
      } else {
        this.toastr.error("Không thành công", "Thất bại");
        this.getAllMeetingByCompany();
      }
    })
  }

  onSubmitUpdate() {
    const id: number = this.infoMeeting.value.id

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        moment.tz.setDefault('Asia/Bangkok');
        const base64String = reader.result as string;
        this.infoMeeting.value.imageBanner = base64String;
        this.meetingService.update(id, this.infoMeeting.value).subscribe((res) => {
          if (res) {
            this.toastr.success("Sửa thành công", "Thành công")
            this.getAllMeetingByCompany()
            this.router.navigate(['/admin/shareholder/'+id])
          } else {
            this.toastr.error("Không thành công", "Thất bại")
            this.getAllMeetingByCompany()
          }
        })
      }
      reader.readAsDataURL(this.selectedFile);
    } else {
      const timestampStart = new Date(this.infoMeeting.value.startTime);
      const timestampEnd = new Date(this.infoMeeting.value.endTime);
      this.infoMeeting.value.startTime = timestampStart
      this.infoMeeting.value.endTime = timestampEnd
      this.meetingService.update(id, this.infoMeeting.value).subscribe((res) => {
        if (res) {
          this.toastr.success("Sửa thành công", "Thành công")
          this.getAllMeetingByCompany()
          this.router.navigate(['/admin/shareholder/'+id])
        } else {
          this.toastr.error("Không thành công", "Thất bại")
          this.getAllMeetingByCompany()
        }
      })
    }
  }

  list: any[] = []
  toList: any[] = []
  id!: number;
  listCompany: any = [];
  toListCompany: any = [];
  getAllCompany() {
    this.companyService.getAll().subscribe((companys) => {
      this.listCompany = companys;
      this.toListCompany = Object.values(this.listCompany.items);
    })
  }

  getAllMeetingByCompany() {
    this.meetingService.getAll().subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
    });
    this.isLoading = false;
  }

  imageError!: any;
  isImageSaved!: boolean;
  cardImageBase64!: any;

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.fileUpload = fileInput.target.files[0];
      const max_size = 10485760;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Ảnh không được vượt quá 5MB';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = (rs: any) => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;

            // this.previewImagePath = imgBase64Path;
          }
          return true; // add a return statement here
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return null;
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }
  selectIdMeeting!: number
  getIdMeeting(idMeeting: number) {
    this.selectIdMeeting = idMeeting
  }
  data: any = [];
  infoMeeting: FormGroup = new FormGroup({});
  idCompany!: number

  infoCompany: FormGroup = new FormGroup({});

  // getCompanyById(): void {
  //   this.idCompany = Number(localStorage.getItem("idCompany"))
  //   this.companyService.getById(this.idCompany).subscribe((res: any) => {
  //     this.data = res;
  //   })
  // }
  imageForm!: FormGroup;
  imageControl!: FormControl;

  editMeeting(id: number) {
    this.imageControl = new FormControl(); // Tạo form control cho ảnh
    this.imageForm = new FormGroup({
      image: this.imageControl // Gán form control vào form group
    });

    this.meetingService.getById(id).subscribe((res: any) => {
      this.data = res;
      this.data.items.startTime = moment(this.data.items.startTime).utc().subtract(7, 'hours');
      this.data.items.endTime = moment(this.data.items.endTime).utc().subtract(7, 'hours');
      this.infoMeeting = this.fb.group({
        id: this.data.items.id,
        idCompany: this.data.items.idCompany,
        nameMeeting: this.data.items.nameMeeting,
        numberOrganized: this.data.items.numberOrganized,
        yearOrganized: this.data.items.yearOrganized,
        status: this.data.items.status,
        imageBanner: this.data.items.imageBanner,
        startTime: this.datePipe.transform(this.data.items.startTime, 'yyyy-MM-dd HH:mm:ss.SSS'),
        endTime: this.datePipe.transform(this.data.items.endTime, 'yyyy-MM-dd HH:mm:ss.SSS'),
        address: this.data.items.address,
        description: this.data.items.description,
      });
    });

  }
  dataCompany: any = []
  editCompany(id: number) {
    this.companyService.getById(id).subscribe((res: any) => {
      this.dataCompany = res;
      this.dataCompany.items.foundedYear = moment(this.dataCompany.items.foundedYear);
      this.infoCompany = this.fb.group({
        id: this.dataCompany.items.id,
        companyName: this.dataCompany.items.companyName,
        stockCode: this.dataCompany.items.stockCode,
        taxCode: this.dataCompany.items.taxCode,
        address: this.dataCompany.items.address,
        foundedYear: this.datePipe.transform(this.dataCompany.items.foundedYear, 'yyyy-MM-dd'),
      });
    });

  }

}
