import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { PasswordPolicy, PasswordValidationResult } from '../../managements/usermanagement/usermanagement';

@Component({
    standalone: true,
    selector: 'app-registration',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, SelectModule],
    templateUrl: './registration.html',
    styleUrl: './registration.css',
})
export class Registration {
    errorRegistration: any = { error: false, message: 'Error Message', title: 'Error!' };
    successRegistration: any = { success: false, message: 'Registration Success', title: 'Success!' };
    registerForm = new FormGroup({
        fullname: new FormControl('', [Validators.required]),
        mobilename: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });
    loading = false;

    // Helper getter untuk akses kontrol form di template
    get f() {
        return this.registerForm.controls;
    }

    constructor(private router: Router) {}

    onRegister() {
        if (this.registerForm.valid) {
            console.log('Register data:', this.registerForm.value);
        }
    }

    onCancel() {
        this.registerForm.reset();
    }

    onSubmit() {
        if (this.registerForm.invalid) return;

        const registerFormValue = this.registerForm.value;
        if (registerFormValue.username && registerFormValue.username.length < 6) {
            this.errorRegistration = {
                error: true,
                severity: 'error',
                message: 'Username cannot less than 6 characters',
                icon: 'pi pi-exclamation-circle',
            };
            return;
        }
        // ########## CHECK PASSWORD ATTRIBUTE ########
        const policy = {
            minLength: 8,
            requireUppercase: true,
            requireNumber: true,
            requireSpecialChar: true,
            allowedSpecialChars: '!@#$%^&*()_+[]{}|;:,.?~-',
        };
        const resultValidasiPassword = this._validatePassword(registerFormValue?.password!, policy);

        if (!resultValidasiPassword.valid) {
            this.errorRegistration = { error: true, severity: 'error', message: resultValidasiPassword.errors, icon: 'pi pi-exclamation-circle' };
            return;
        }

        this.loading = true;
        fetch('/v2/auth/registuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.registerForm.value),
        })
            .then((res) => {
                // console.log("Response dari API ", res);
                if (!res.ok) throw new Error('Login gagal');
                return res.json();
            })
            .then((data) => {
                // // console.log("Response dari API DATA ", data);
                this.loading = false;
                if (data.code === 20000) {
                    this.successRegistration = { success: true, message: `Registration Success and ${data.message}`, title: 'Success Register!' };
                } else {
                    this.errorRegistration = { error: true, message: data.message, title: 'Error Registration!' };
                }
            })
            .catch((err) => {
                console.log('Response Error ', err);
                this.loading = false;
                this.errorRegistration = { error: true, message: err.message, title: 'Error!' };
            });
    }

    async cancelError() {
        this.errorRegistration = { error: false, message: 'Error Message', title: 'Error!' };
        // this.router.navigate(['/login']);
    }

    async cancelSuccess() {
        this.successRegistration = { success: false, message: 'Registration Success', title: 'Success!' };
        this.router.navigate(['/dashboard']);
    }

    _validatePassword(password: string, policy: PasswordPolicy): PasswordValidationResult {
        const errors: string[] = [];

        if (policy.minLength && password.length < policy.minLength) {
            errors.push(`Password must be at least ${policy.minLength} characters long`);
        }

        if (policy.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least 1 uppercase letter');
        }

        if (policy.requireNumber && !/[0-9]/.test(password)) {
            errors.push('Password must contain at least 1 number');
        }

        if (policy.requireSpecialChar) {
            // default aman (tidak termasuk < > " ' ` \ /)
            const safeSpecials = policy.allowedSpecialChars || '!@#$%^&*()_+[]{}|;:,.?~-';

            const regex = new RegExp(`[${safeSpecials.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);

            if (!regex.test(password)) {
                errors.push('Password must contain at least 1 special character');
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
