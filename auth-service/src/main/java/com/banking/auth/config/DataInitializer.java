package com.banking.auth.config;

import com.banking.auth.model.Role;
import com.banking.auth.model.RoleName;
import com.banking.auth.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role customerRole = new Role();
            customerRole.setName(RoleName.ROLE_CUSTOMER);
            customerRole.setDescription("Customer role with basic banking privileges");
            roleRepository.save(customerRole);

            Role employeeRole = new Role();
            employeeRole.setName(RoleName.ROLE_EMPLOYEE);
            employeeRole.setDescription("Employee role with administrative privileges");
            roleRepository.save(employeeRole);

            Role adminRole = new Role();
            adminRole.setName(RoleName.ROLE_ADMIN);
            adminRole.setDescription("Admin role with full system access");
            roleRepository.save(adminRole);

            System.out.println("Roles initialized successfully!");
        }
    }
}
