import {Inject, Injectable} from '@angular/core';
import {S3} from '@aws-sdk/client-s3';
import {from, Observable, of, Subject} from 'rxjs';
import {HeadObjectCommandOutput} from '@aws-sdk/client-s3/commands/HeadObjectCommand';
import {PutObjectCommandOutput} from '@aws-sdk/client-s3/commands/PutObjectCommand';
import {DeleteObjectCommandOutput} from '@aws-sdk/client-s3/commands/DeleteObjectCommand';

@Injectable({
  providedIn: 'root'
})
export class S3StoreService {
  private readonly s3: S3;
  private readonly bucketName: string;
  public readonly baseUrl: string;
  public readonly cdnUrl: string | undefined;
  public readonly defaultKey: string | undefined;
  public readonly uploadProgress = new Subject<any>();

  constructor(@Inject('config') private config: S3ServiceConfig) {
    this.s3 = new S3({
      apiVersion: config.apiVersion || 'latest',
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      }
    });
    this.bucketName = config.bucketName;
    this.baseUrl = `https://${config.bucketName}.s3-${config.region}.amazonaws.com`;
    this.cdnUrl = config.cdnUrl;
  }

  getConfig(): any {
    // Make sure tree shaking won't remove the lib during the build
    return {
      bucketName: this.bucketName,
      baseUrl: this.baseUrl,
      cdnUrl: this.cdnUrl,
    };
  }

  getObjectUrl(key?: string): string {
    if (!key) {
      return this.cdnUrl + (this.defaultKey || '');
    }
    return this.cdnUrl + key;
  }

  checkObjectExisted(key: string): Observable<HeadObjectCommandOutput | null>  {
    if (!key) { return of(null); }
    const params = {
      Bucket: this.bucketName,
      Key: key
    };
    return from(this.s3.headObject(params));
  }

  putObject(file: any, key: string): Observable<PutObjectCommandOutput> {
    const params = {
      Body: file,
      Bucket: this.bucketName,
      Key: key,
    };
    const promise = this.s3.putObject(params);
    return from(promise);
  }

  deleteObject(key: string): Observable<DeleteObjectCommandOutput | null> {
    if (!key) { return of(null); }
    const params = {
      Bucket: this.bucketName,
      Key: key
    };
    const promise = this.s3.deleteObject(params);
    return from(promise);
  }

  // uploadObject(file: any, key: string): Observable<any> {
  //   const params = {
  //     Body: file,
  //     Bucket: this.bucketName,
  //     Key: key,
  //   };
  //   const promise = this.s3(params).on('httpUploadProgress', (event: any) => {
  //     console.log(`#Uploaded :: ${event.loaded * 100 / event.total}%`);
  //     this.uploadProgress.next({
  //       loaded: event.loaded,
  //       total: event.total,
  //       percent: Math.floor(event.loaded * 100 / event.total)
  //     });
  //   }).promise();
  //   return from(promise);
  // }
}

export interface S3ServiceConfig {
  apiVersion?: string | 'latest';
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  cdnUrl?: string;
  defaultFileKey: string;
}
