package com.practice.todo.todo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {


    @GetMapping({"", "/", "/home"})
    public String home(){
        // ModelAndView mav = new ModelAndView("home");
        // mav.addObject(, mav)

        return "home";
    }
    
}
