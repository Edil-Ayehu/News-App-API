import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, ) {
        // token expired
        if (info?.name === 'TokenExpiredError') {
            throw new UnauthorizedException("Session expired! Please login again.");
        }

        // invalid token
        if (info?.name === 'JsonWebTokenError') {
            throw new UnauthorizedException("Invalid token");
        }

        // no token
        if (!user) {
            throw new UnauthorizedException("Invalid or expired token");
        }
        
        return user;
    }
}
