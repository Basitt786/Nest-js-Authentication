import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { schema } from '../drizzle/types/schema.data';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { users } from '../drizzle/schema/register.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
// import { access } from 'fs';

interface JwtUserPayload {
  sub: string;
  email: string;
  role: 'user' | 'admin';
}



@Injectable()
export class AuthService {
    constructor(@Inject(DRIZZLE) private readonly db: NeonHttpDatabase<typeof schema>, private jwtService: JwtService) { }

   private async generateToken(user: JwtUserPayload): Promise<string> {
         return this.jwtService.sign(user);
    }

    //ye all data fetch kar raha hai
    async getAllData(): Promise<CreateUserDto[]> {
        try {
        const result = await this.db.select().from(users)
        return result as CreateUserDto[];
        }catch (error) {
            console.error('Error fetching all data:', error);
            throw new BadRequestException('Failed to fetch data');
            
        }

    }

    // ye check kar raha data exist karta hai ya nahi

     async checkdata(data: CreateUserDto) {
        try {

         if (!data.email || !data.password || !data.name) {
                throw new BadRequestException('Missing required fields');
            }

        const result = await this.db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1)

         if (result.length > 0) {
            throw new ConflictException('User already exists')
        } 

        const hashed = await argon2.hash(data.password)
       
        //ye new user insert kar raha hai
       
        const [ newuser ] = await this.db.insert(users).values({
            name: data.name,
            email: data.email,
            password: hashed,
            role: data.role ?? 'user',
        }).returning()

        const {password, ...datalist} = newuser;

        console.log('Generating token for user:', newuser.id);

        const token = await this.generateToken({
            sub: newuser.id,
            email: newuser.email,
            role: newuser.role as 'user' | 'admin',
        })

         console.log('Token generated successfully');
        
        return { 
            ...datalist,
            access_token: token,
            success: true,
            message: 'Registration successful'
        };

    } catch (error) {
            console.error('Registration error:', error);
            // Re-throw if it's already a NestJS exception
            if (error instanceof ConflictException || 
                error instanceof BadRequestException ||
                error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException('Registration failed');
        }

    }

    //ye user ko check kar raha hai 

    async loginData(data: LoginDto) {
      try {
        
         if (!data.email || !data.password) {
                throw new BadRequestException('Email and password required');
            }

        const [ user ] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1)

        console.log('User found:', user ? 'Yes' : 'No');
        if (!user) {
            throw new UnauthorizedException('Invalid Users')
        }

        

        const isvalidpassword = await argon2.verify(user.password, data.password);

        if (!isvalidpassword) {
            throw new UnauthorizedException('invalid password')
        }

        const {password, ...result} = user;

            return result

        }catch (error) {
                console.error('Login error:', error);
                if (error instanceof UnauthorizedException || 
                    error instanceof BadRequestException) {
                    throw error;
                }
                throw new UnauthorizedException('Login failed');
            }

        }

    async getprofile(userId: string) {

     try {
            if (!userId) {
                throw new BadRequestException('User ID required');
            }

                    
            const [ userdata ] = await this.db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            

            if (!userdata) {
                    throw new UnauthorizedException('User not found')
            }

            const {password, ...profile} = userdata;

                return profile;
            
        }catch (error) {
            console.error('Get profile error:', error);
            throw new BadRequestException('Failed to fetch profile');
        }
    }
}

    

