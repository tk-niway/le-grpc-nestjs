// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.0
// source: src/proto/sample.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "sample";

export interface SampleDataById {
  id: number;
}

export interface SampleData {
  id: number;
  name: string;
}

export const SAMPLE_PACKAGE_NAME = "sample";

export interface AppServiceClient {
  findOne(request: SampleDataById): Observable<SampleData>;

  findMany(request: Observable<SampleDataById>): Observable<SampleData>;
}

export interface AppServiceController {
  findOne(request: SampleDataById): Promise<SampleData> | Observable<SampleData> | SampleData;

  findMany(request: Observable<SampleDataById>): Observable<SampleData>;
}

export function AppServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AppService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["findMany"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AppService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const APP_SERVICE_NAME = "AppService";
