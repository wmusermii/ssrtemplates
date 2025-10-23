import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { map, Observable } from 'rxjs';

/** Struktur konfigurasi service */
export interface FlowableConfig {
  baseUrl?: string;               // contoh: http://localhost:8080/flowable-task/process-api
  username?: string;              // contoh: marketing
  password?: string;
  groupid?:string;              // contoh: manage
}

/** Struktur definisi Flowable */
export interface FlowableProcessDefinition {
  id: string;
  key: string;
  name: string;
  version: number;
  deploymentId: string;
  resource: string;
}

@Injectable({
  providedIn: 'root'
})

export class Taskservice {
    private config!: FlowableConfig;
    constructor(private http: HttpClient, @Optional() @Inject('FLOWABLE_CONFIG') config?: FlowableConfig) {
      if (config) this.config = config;
    }
  /** 🔧 Set konfigurasi secara dinamis dari parent */
  setConfig(config: FlowableConfig) {
    this.config = config;
  }
  /** 🔑 Generate Basic Auth header */
  private getAuthHeaders(): HttpHeaders {
    if (!this.config) throw new Error('Flowable configuration not set!');
    const basicAuth = 'Basic ' + btoa(`${this.config.username}:${this.config.password}`);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': basicAuth
    });
  }
  /** 🔹 Request generik (bisa dipakai oleh semua method) */
  request<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, params?: any): Observable<T> {
    if (!this.config) throw new Error('Flowable configuration not set!');
    const headers = this.getAuthHeaders();
    const url = `${this.config.baseUrl}/${endpoint}`;

    console.log("*** URL : ", url);

    return this.http.request<T>(method, url, { headers, body, params });
  }

  /** 🔹 Get semua process definition */
  getProcessDefinitions(): Observable<FlowableProcessDefinition[]> {
    return this.request<{ data: FlowableProcessDefinition[] }>('repository/process-definitions', 'GET')
      .pipe(map(resp => resp.data));
  }

  /** 🔹 Get process definition by key */
  getProcessDefinitionByKey(processKey: string): Observable<FlowableProcessDefinition | undefined> {
    const params = new HttpParams().set('key', processKey);
    return this.request<{ data: FlowableProcessDefinition[] }>(
      'repository/process-definitions', 'GET', undefined, params
    ).pipe(map(resp => resp.data?.[0]));
  }

  /** 🔹 Start process instance */
  startProcessInstance(
    processDefinitionKey: string,
    businessKey: string,
    variables: { name: string; value: any }[]
  ): Observable<any> {
    const body = { processDefinitionKey, businessKey, variables };
    return this.request<any>('runtime/process-instances', 'POST', body);
  }

  /** 🔹 Get tasks by process instance ID */
  getTasksByProcessInstance(processInstanceId: string): Observable<any> {
    const params = new HttpParams().set('processInstanceId', processInstanceId);
    return this.request<{ data: any[] }>('runtime/tasks', 'GET', undefined, params)
      .pipe(map(resp => resp.data));
  }

  /** 🔹 Complete task */
  completeTask(taskId: string, outcome: string, variables: { name: string; value: any }[]): Observable<any> {
    const body = { action: 'complete', outcome, variables };
    return this.request<any>(`runtime/tasks/${taskId}`, 'POST', body);
  }
}
