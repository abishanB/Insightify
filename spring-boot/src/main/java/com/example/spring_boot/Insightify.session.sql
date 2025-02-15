SELECT COUNT(a) FROM artists a;
SELECT pg_size_pretty(pg_total_relation_size('artists'));