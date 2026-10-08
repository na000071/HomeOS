using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using HomeOS.Api.Models;

namespace HomeOS.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Appliance> Appliances => Set<Appliance>();

    public DbSet<Room> Rooms => Set<Room>();

    public DbSet<MaintenanceTask> MaintenanceTasks => Set<MaintenanceTask>();

    public DbSet<Warranty> Warranties => Set<Warranty>();

    public DbSet<Expense> Expenses => Set<Expense>();

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<Reminder> Reminders => Set<Reminder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Appliance>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(appliance => appliance.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Appliance>().HasIndex(appliance => appliance.UserId);

        modelBuilder.Entity<Room>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(room => room.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Room>().HasIndex(room => room.UserId);

        modelBuilder.Entity<MaintenanceTask>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(task => task.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<MaintenanceTask>().HasIndex(task => task.UserId);

        modelBuilder.Entity<Warranty>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(warranty => warranty.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Warranty>().HasIndex(warranty => warranty.UserId);

        modelBuilder.Entity<Expense>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(expense => expense.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Expense>().HasIndex(expense => expense.UserId);

        modelBuilder.Entity<Document>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(document => document.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Document>().HasIndex(document => document.UserId);

        modelBuilder.Entity<Reminder>().HasOne<ApplicationUser>()
            .WithMany().HasForeignKey(reminder => reminder.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Reminder>().HasIndex(reminder => reminder.UserId);

        modelBuilder.Entity<Appliance>(entity =>
        {
            entity.HasOne(appliance => appliance.Room)
                .WithMany(room => room.Appliances)
                .HasForeignKey(appliance => appliance.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(appliance => appliance.MaintenanceTasks)
                .WithOne(task => task.Appliance)
                .HasForeignKey(task => task.ApplianceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(appliance => appliance.Warranties)
                .WithOne(warranty => warranty.Appliance)
                .HasForeignKey(warranty => warranty.ApplianceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(appliance => appliance.Reminders)
                .WithOne(reminder => reminder.Appliance)
                .HasForeignKey(reminder => reminder.ApplianceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(appliance => appliance.Expenses)
                .WithOne(expense => expense.Appliance)
                .HasForeignKey(expense => expense.ApplianceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(appliance => appliance.Documents)
                .WithOne(document => document.Appliance)
                .HasForeignKey(document => document.ApplianceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.Property(appliance => appliance.PurchasePrice)
                .HasPrecision(18, 2);
        });

        modelBuilder.Entity<MaintenanceTask>(entity =>
        {
            entity.HasMany(task => task.Reminders)
                .WithOne(reminder => reminder.MaintenanceTask)
                .HasForeignKey(reminder => reminder.MaintenanceTaskId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Warranty>(entity =>
        {
            entity.HasMany(warranty => warranty.Reminders)
                .WithOne(reminder => reminder.Warranty)
                .HasForeignKey(reminder => reminder.WarrantyId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasMany(expense => expense.Reminders)
                .WithOne(reminder => reminder.Expense)
                .HasForeignKey(reminder => reminder.ExpenseId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(expense => expense.MaintenanceTask)
                .WithMany(task => task.Expenses)
                .HasForeignKey(expense => expense.MaintenanceTaskId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.Property(expense => expense.Amount)
                .HasPrecision(18, 2);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasOne(document => document.Expense)
                .WithMany(expense => expense.Documents)
                .HasForeignKey(document => document.ExpenseId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}