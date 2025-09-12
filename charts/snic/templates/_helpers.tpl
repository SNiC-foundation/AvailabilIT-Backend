{{/*
Expand the name of the chart.
*/}}
{{- define "snic.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "snic.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "snic.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "snic.labels" -}}
helm.sh/chart: {{ include "snic.chart" . }}
{{ include "snic.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "snic.selectorLabels" -}}
app.kubernetes.io/name: {{ include "snic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "snic.selectorLabels.backend" -}}
{{ include "snic.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{- define "snic.selectorLabels.frontend" -}}
{{ include "snic.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "snic.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "snic.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}


{{- define "snic.volumeMounts" -}}
- name: uploads
  mountPath: /usr/src/app/data/
{{- end }}

{{- define "snic.volumes" -}}
- name: uploads
  persistentVolumeClaim:
    claimName: {{ include "snic.fullname" . }}-uploads
{{- end }}



{{/*
Create the environment variables used by the Python app
*/}}
{{- define "snic.appEnvironment" }}
    - name: TYPEORM_CONNECTION
      value: postgres
    - name: TYPEORM_HOST
      value: {{ (include "snic.fullname" .) }}-postgresql
    - name: TYPEORM_PORT
      value: "5432"
    - name: TYPEORM_DATABASE
      value: {{ .Values.postgresql.auth.database }}
    - name: TYPEORM_USERNAME
      value: {{ .Values.postgresql.auth.username }}
    - name: TYPEORM_PASSWORD
{{ if .Values.postgresql.auth.existingSecret }}
      valueFrom:
          secretKeyRef:
              name: {{ .Values.postgresql.auth.existingSecret }}
              key: password
{{ else }}
      value: {{ .Values.postgresql.auth.password }}
{{ end }}
    - name: TYPEORM_SYNCHRONIZE
      value: "false"
    - name: TYPEORM_LOGGING
      value: "false"
{{- end }}

