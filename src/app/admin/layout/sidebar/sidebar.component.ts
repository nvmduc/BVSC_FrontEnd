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


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  selectedItemMeeting!: number;


  constructor(private meetingService: MeetingService, private fb: FormBuilder,
    private toastr: ToastrService, private imageCompess: NgxImageCompressService,
    private http: HttpClient, private datePipe: DatePipe, private companyService: CompanyService) {
    this.getAllMeetingByCompany();



  }
  selectItem(index: number) {
    localStorage.setItem('idMeeting', String(index))
    // this.selectedItemMeeting = index;
    this.selectedItemMeeting = Number(localStorage.getItem('idMeeting'))
    if (localStorage.getItem('idMeeting') == null) {
      localStorage.setItem('idMeeting', String(this.selectedItemMeeting))
    } else {
      index = Number(localStorage.getItem('idMeeting'))
    }
  }

  ngOnInit(): void {
    this.imageControl = new FormControl(); // Tạo form control cho ảnh
    this.infoMeeting = new FormGroup({
      image: this.imageControl // Gán form control vào form group
    });
    this.selectedItemMeeting = Number(localStorage.getItem('idMeeting'));
    this.getCompanyById()
    this.infoMeeting = this.fb.group({
      id: [],
      idCompany: [localStorage.getItem("idCompany")],
      nameMeeting: [""],
      numberOrganized: [""],
      yearOrganized: [""],
      status: ["0"],
      imageBanner: [""],
      startTime: [""],
      endTime: [""],
      address: [""],
    })
  }
  imgURL: any;

  dataFormMeeting = this.fb.group({
    idCompany: [localStorage.getItem("idCompany")],
    nameMeeting: [""],
    numberOrganized: [""],
    yearOrganized: [""],
    status: ["0"],
    imageBanner: [""],
    startTime: [""],
    endTime: [""],
    address: [""],
  });

  get g() {
    return this.dataFormMeeting.controls
  }

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

  uploadBase64ToServer(base64String: string): void {
    const idCompany = this.dataFormMeeting.value.idCompany;
    this.dataFormMeeting.value.imageBanner = base64String;
    // Đặt múi giờ thành UTC+7
    moment.tz.setDefault('Asia/Bangkok');
    this.meetingService.create(this.dataFormMeeting.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Thêm mới thành công", "Thành công");
        this.getAllMeetingByCompany();
        setInterval(() => {
          window.location.reload();
        }, 1500);
      } else {
        this.toastr.error("Không thành công", "Thất bại");
        this.getAllMeetingByCompany();
      }
    })
  }

  onSubmitUpdate() {
    const id = this.infoMeeting.value.id

    this.infoMeeting.value.startTime = moment(this.infoMeeting.value.startTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.infoMeeting.value.endTime = moment(this.infoMeeting.value.endTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        this.infoMeeting.value.imageBanner = base64String;

        this.meetingService.update(id, this.infoMeeting.value).subscribe((res) => {
          if (res) {
            this.toastr.success("Sửa thành công", "Thành công")
            this.getAllMeetingByCompany()
            setInterval(() => {
              window.location.reload();
            }, 1500);
          } else {
            this.toastr.error("Không thành công", "Thất bại")
            this.getAllMeetingByCompany()
          }
        })
      }
      reader.readAsDataURL(this.selectedFile);
    }
  }

  list: any[] = []
  toList: any[] = []

  id!: number;
  getAllMeetingByCompany() {
    const idCompany = localStorage.getItem('idCompany');
    if (idCompany) {
      this.id = parseInt(idCompany, 10);

      this.meetingService.getByIdCompany(this.id).subscribe((res) => {
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
      });
    }
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

  getCompanyById(): void {
    this.idCompany = Number(localStorage.getItem("idCompany"))
    this.companyService.getById(this.idCompany).subscribe((res: any) => {
      this.data = res;
    })
  }
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
      });
    });

  }



}
