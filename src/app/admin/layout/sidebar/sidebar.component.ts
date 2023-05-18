import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import * as _ from 'lodash';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private meetingService: MeetingService, private fb: FormBuilder,
    private toastr: ToastrService, private imageCompess: NgxImageCompressService,private http: HttpClient) {
    this.getAllMeetingByCompany();



  }

  ngOnInit(): void {

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
          console.log(fileContent); // In ra nội dung của file ảnh dưới dạng base64
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
        console.log('Base64:', base64String);
        this.uploadBase64ToServer(base64String);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadBase64ToServer(base64String: string): void {
    // const jsonData = {
    //   base64Data: base64String
    // };
    const idCompany = this.dataFormMeeting.value.idCompany;
    this.dataFormMeeting.value.imageBanner = base64String;
    
    this.meetingService.create(this.dataFormMeeting.value).subscribe((res) => {
      console.log('resssss: ', res);
      
      if (res) {
        console.log("Update Success");
        this.toastr.success("Thêm mới thành công", "Thành công");
        this.getAllMeetingByCompany();
      } else {
        console.log("Update False");
        this.toastr.error("Không thành công", "Thất bại");
        this.getAllMeetingByCompany();
      }
    })
  }
  
  list: any[] = []
  toList: any[] = []

  id!: number;
  getAllMeetingByCompany() {
    const idCompany = localStorage.getItem('idCompany');
    if (idCompany) {
      this.id = parseInt(idCompany, 10);
      console.log(this.id);

      this.meetingService.getByIdCompany(this.id).subscribe((res) => {
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
        console.log(this.list);
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
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

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

        console.log(e)
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


}
