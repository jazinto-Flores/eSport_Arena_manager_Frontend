package cl.esports.arena.config;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.*;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
 @Bean SecretKey jwtSecret(@Value("${app.jwt.secret}") String value){ if(value.length()<32) throw new IllegalStateException("Define JWT_SECRET con al menos 32 caracteres"); return new SecretKeySpec(value.getBytes(StandardCharsets.UTF_8),"HmacSHA256"); }
 @Bean JwtDecoder jwtDecoder(SecretKey key){var decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
  var original = JwtValidators.createDefault();
  decoder.setJwtValidator(jwt -> {
   var valid = original.validate(jwt);
   if(!valid.hasErrors() && !"access".equals(jwt.getClaimAsString("tipo")))
    return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.failure(new org.springframework.security.oauth2.core.OAuth2Error("invalid_token","Se requiere token de acceso",null));
   return valid;
  });
  return decoder;}
 @Bean JwtEncoder jwtEncoder(SecretKey key){return new NimbusJwtEncoder(new com.nimbusds.jose.jwk.source.ImmutableSecret<>(key));}
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean JwtAuthenticationConverter converter(){var c=new JwtAuthenticationConverter();c.setJwtGrantedAuthoritiesConverter(jwt-> List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_"+jwt.getClaimAsString("rol"))));return c;}
 @Bean SecurityFilterChain filter(HttpSecurity http, JwtAuthenticationConverter converter) throws Exception {
  return http.csrf(c->c.disable()).cors(c->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  .authorizeHttpRequests(a->a.requestMatchers("/api/health","/api/auth/registro","/api/auth/login","/api/auth/refresh","/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**").permitAll()
    .requestMatchers(HttpMethod.GET,"/api/torneos","/api/torneos/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated())
  .oauth2ResourceServer(o->o.jwt(j->j.jwtAuthenticationConverter(converter))).build();
 }
 @Bean CorsConfigurationSource cors(@Value("${app.cors.origin}") String origin){var cfg=new CorsConfiguration(); cfg.setAllowedOrigins(Arrays.stream(origin.split(",")).map(String::trim).toList());cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));cfg.setAllowedHeaders(List.of("Authorization","Content-Type"));cfg.setAllowCredentials(false);var source=new UrlBasedCorsConfigurationSource();source.registerCorsConfiguration("/**",cfg);return source;}
}
